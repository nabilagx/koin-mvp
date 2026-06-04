"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { formNumber, formString } from "@/lib/format";
import { hashPin } from "@/lib/pin";
import { actionMessage, friendlyError, getReturnTo, rethrowRedirect } from "@/lib/action-result";
import { getDailyLimitUsage } from "@/lib/limits";
import { createAdminClient } from "@/lib/supabase/admin";

const canteenPath = "/dashboard/canteen";
type CartItem = { product_id: string; name: string; price: number; qty: number; subtotal: number };

export type CanteenCardPreview = {
  ok: boolean;
  child_name?: string;
  grade?: string | null;
  school_name?: string | null;
  card_status?: string;
  remaining_limit_today?: number;
  can_continue: boolean;
  warning?: string;
  reason?: string;
};

async function requireCanteenContext() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "CANTEEN") redirect("/dashboard");

  const admin = createAdminClient();
  const { data: canteen, error } = await admin
    .from("canteens")
    .select("id,canteen_name,status")
    .eq("user_id", profile.id)
    .single();

  if (error || !canteen) throw new Error("Profil canteen belum tersedia.");
  return { profile, canteen, admin };
}

async function createFailedTransaction(
  admin: ReturnType<typeof createAdminClient>,
  canteen_id: string,
  amount: number,
  failure_reason: string,
  child_id: string | null = null,
  card_id: string | null = null
) {
  await admin.from("transactions").insert({
    child_id,
    canteen_id,
    card_id,
    amount,
    status: "failed",
    failure_reason
  });
}

export async function createProductAction(formData: FormData) {
  const returnTo = getReturnTo(formData, `${canteenPath}?view=products`);
  try {
  const { canteen, admin } = await requireCanteenContext();
  if (canteen.status !== "active") throw new Error("Kantin belum aktif.");
  const name = formString(formData, "name");
  const price = formNumber(formData, "price");
  if (!name || price < 0) throw new Error("Nama produk dan harga wajib valid.");

  const { error } = await admin.from("products").insert({
    canteen_id: canteen.id,
    name,
    price,
    is_active: true
  });

  if (error) throw new Error(error.message);
  revalidatePath(canteenPath);
  actionMessage(returnTo, "success", "Produk berhasil ditambahkan.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}

export async function previewCanteenCardAction(card_uid: string, cart_total: number): Promise<CanteenCardPreview> {
  try {
    const { canteen, admin } = await requireCanteenContext();
    if (canteen.status !== "active") return { ok: false, can_continue: false, reason: "Kantin belum aktif." };
    const uid = card_uid.trim();
    if (!uid) return { ok: false, can_continue: false, reason: "Kartu tidak dikenal." };

    const { data: card } = await admin
      .from("cards")
      .select("id,child_id,status")
      .eq("card_uid", uid)
      .maybeSingle();

    if (!card) return { ok: false, can_continue: false, reason: "Kartu tidak dikenal." };
    if (card.status !== "active") {
      return { ok: false, card_status: card.status, can_continue: false, reason: "Kartu tidak aktif." };
    }

    const { data: child } = await admin
      .from("children")
      .select("id,name,grade,school_name,daily_limit")
      .eq("id", card.child_id)
      .single();

    if (!child) return { ok: false, can_continue: false, reason: "Data anak tidak ditemukan." };

    const usage = await getDailyLimitUsage(admin, child.id, child.daily_limit);
    return {
      ok: true,
      child_name: child.name,
      grade: child.grade,
      school_name: child.school_name,
      card_status: card.status,
      remaining_limit_today: usage.remaining_today,
      can_continue: true,
      warning: cart_total > usage.remaining_today ? "Sisa limit tidak cukup untuk transaksi ini." : undefined
    };
  } catch (error) {
    return { ok: false, can_continue: false, reason: friendlyError(error) };
  }
}

export async function createCanteenTransactionAction(formData: FormData) {
  const returnTo = getReturnTo(formData, canteenPath);
  try {
  const { canteen, admin } = await requireCanteenContext();
  if (canteen.status !== "active") throw new Error("Kantin belum aktif.");
  const card_uid = formString(formData, "card_uid");
  let amount = formNumber(formData, "amount");
  const product_id = formString(formData, "product_id");
  const cart_items_raw = formString(formData, "cart_items");
  const qty = Math.max(formNumber(formData, "qty") || 1, 1);
  const pin = formString(formData, "pin");
  let cart_items = cart_items_raw ? (JSON.parse(cart_items_raw) as CartItem[]) : [];
  if (cart_items.length > 0) {
    const product_ids = cart_items.map((item) => item.product_id);
    const { data: db_products } = await admin
      .from("products")
      .select("id,name,price")
      .eq("canteen_id", canteen.id)
      .eq("is_active", true)
      .in("id", product_ids);
    cart_items = cart_items.map((item) => {
      const product = (db_products ?? []).find((dbProduct) => dbProduct.id === item.product_id);
      if (!product) throw new Error("Produk aktif tidak ditemukan.");
      const next_qty = Math.max(Number(item.qty), 1);
      const price = Number(product.price);
      return {
        product_id: product.id,
        name: product.name,
        price,
        qty: next_qty,
        subtotal: price * next_qty
      };
    });
    amount = cart_items.reduce((total, item) => total + item.subtotal, 0);
  }

  if (!card_uid || !pin) throw new Error("UID kartu dan PIN wajib diisi.");

  const { data: card, error: cardError } = await admin
    .from("cards")
    .select("id,child_id,status")
    .eq("card_uid", card_uid)
    .maybeSingle();

  if (cardError || !card) {
    await createFailedTransaction(admin, canteen.id, Math.max(amount, 1), "Kartu tidak ditemukan.");
    revalidatePath(canteenPath);
    actionMessage(returnTo, "error", "Transaksi gagal: Kartu tidak ditemukan");
  }

  if (card.status !== "active") {
    await createFailedTransaction(admin, canteen.id, Math.max(amount, 1), "Kartu tidak aktif.", card.child_id, card.id);
    revalidatePath(canteenPath);
    actionMessage(returnTo, "error", "Transaksi ditolak: kartu tidak aktif.");
  }

  const { data: child, error: childError } = await admin
    .from("children")
    .select("id,daily_limit,pin_hash")
    .eq("id", card.child_id)
    .single();

  if (childError || !child) {
    await createFailedTransaction(admin, canteen.id, Math.max(amount, 1), "Data anak tidak ditemukan.", card.child_id, card.id);
    revalidatePath(canteenPath);
    actionMessage(returnTo, "error", "Transaksi gagal: Data anak tidak ditemukan");
  }

  if (child.pin_hash !== hashPin(pin)) {
    await createFailedTransaction(admin, canteen.id, Math.max(amount, 1), "PIN salah", child.id, card.id);
    revalidatePath(canteenPath);
    actionMessage(returnTo, "error", "Transaksi gagal: PIN salah");
  }

  let selected_product: { id: string; price: number | string } | null = null;
  if (product_id) {
    const { data: product } = await admin
      .from("products")
      .select("id,price")
      .eq("id", product_id)
      .eq("canteen_id", canteen.id)
      .eq("is_active", true)
      .maybeSingle();
    if (product) {
      selected_product = product;
      amount = Number(product.price) * qty;
    }
  }

  if (amount <= 0) actionMessage(returnTo, "error", "Nominal transaksi wajib valid.");

  const { data: wallet, error: walletError } = await admin
    .from("wallets")
    .select("id,balance")
    .eq("child_id", child.id)
    .single();

  if (walletError || !wallet) {
    await createFailedTransaction(admin, canteen.id, amount, "Saldo anak belum tersedia.", child.id, card.id);
    revalidatePath(canteenPath);
    actionMessage(returnTo, "error", "Transaksi gagal: Saldo anak belum tersedia");
  }

  const usage = await getDailyLimitUsage(admin, child.id, child.daily_limit);
  let failure_reason = "";

  if (Number(wallet.balance) < amount) failure_reason = "Saldo tidak cukup.";
  else if (amount > usage.remaining_today) failure_reason = "Limit harian terlampaui.";

  if (failure_reason) {
    await createFailedTransaction(admin, canteen.id, amount, failure_reason, child.id, card.id);
    revalidatePath(canteenPath);
    actionMessage(returnTo, "error", `Transaksi gagal: ${failure_reason}`);
  }

  const balance = Number(wallet.balance) - amount;
  const { error: updateError } = await admin
    .from("wallets")
    .update({ balance, updated_at: new Date().toISOString() })
    .eq("id", wallet.id);

  if (updateError) throw new Error(updateError.message);

  const { data: transaction, error: transactionError } = await admin
    .from("transactions")
    .insert({
      child_id: child.id,
      canteen_id: canteen.id,
      card_id: card.id,
      amount,
      status: "success",
      failure_reason: null
    })
    .select("id")
    .single();

  if (transactionError || !transaction) throw new Error(transactionError?.message ?? "Transaksi gagal dibuat.");

  if (selected_product) {
      await admin.from("transaction_items").insert({
        transaction_id: transaction.id,
        product_id: selected_product.id,
        qty,
        price: selected_product.price,
        subtotal: Number(selected_product.price) * qty
      });
  }
  if (cart_items.length > 0) {
    await admin.from("transaction_items").insert(
      cart_items.map((item) => ({
        transaction_id: transaction.id,
        product_id: item.product_id,
        qty: item.qty,
        price: item.price,
        subtotal: item.subtotal
      }))
    );
  }

  revalidatePath(canteenPath);
  actionMessage(returnTo, "success", "Transaksi berhasil.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}

export async function updateProductAction(formData: FormData) {
  const returnTo = getReturnTo(formData, `${canteenPath}?view=products`);
  try {
  const { canteen, admin } = await requireCanteenContext();
  if (canteen.status !== "active") throw new Error("Kantin belum aktif.");
  const product_id = formString(formData, "product_id");
  const name = formString(formData, "name");
  const price = formNumber(formData, "price");
  const is_active = formData.get("is_active") === "on";
  const { error } = await admin.from("products").update({ name, price, is_active }).eq("id", product_id).eq("canteen_id", canteen.id);
  if (error) throw new Error(error.message);
  revalidatePath(canteenPath);
  actionMessage(returnTo, "success", "Produk berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}

export async function deactivateProductAction(formData: FormData) {
  const returnTo = getReturnTo(formData, `${canteenPath}?view=products`);
  try {
  const { canteen, admin } = await requireCanteenContext();
  const product_id = formString(formData, "product_id");
  const { error } = await admin.from("products").update({ is_active: false }).eq("id", product_id).eq("canteen_id", canteen.id);
  if (error) throw new Error(error.message);
  revalidatePath(canteenPath);
  actionMessage(returnTo, "success", "Produk berhasil dinonaktifkan.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}
