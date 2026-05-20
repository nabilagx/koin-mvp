"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { getCurrentUserProfile } from "@/lib/auth";
import { formNumber, formString } from "@/lib/format";
import { hashPin } from "@/lib/pin";
import { actionMessage, friendlyError, rethrowRedirect } from "@/lib/action-result";
import { settleTopupOnce } from "@/lib/topup-settlement";
import { createAdminClient } from "@/lib/supabase/admin";

const parentPath = "/dashboard/parent";

async function requireParentContext() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "PARENT") redirect("/dashboard");

  const admin = createAdminClient();
  const { data: parent, error } = await admin
    .from("parents")
    .select("id,user_id")
    .eq("user_id", profile.id)
    .single();

  if (error || !parent) throw new Error("Profil parent belum tersedia.");
  return { profile, parent, admin };
}

async function assertOwnChild(child_id: string) {
  const context = await requireParentContext();
  const { data: child, error } = await context.admin
    .from("children")
    .select("id,parent_id")
    .eq("id", child_id)
    .eq("parent_id", context.parent.id)
    .single();

  if (error || !child) throw new Error("Child tidak ditemukan untuk parent ini.");
  return { ...context, child };
}

async function writeAudit(
  admin: ReturnType<typeof createAdminClient>,
  actor_user_id: string,
  action: string,
  entity_type: string,
  entity_id: string | null,
  description: string
) {
  await admin.from("audit_logs").insert({
    actor_user_id,
    action,
    entity_type,
    entity_id,
    description
  });
}

export async function createChildAction(formData: FormData) {
  try {
  const { profile, parent, admin } = await requireParentContext();
  const name = formString(formData, "name");
  const email = formString(formData, "email").toLowerCase();
  const password = formString(formData, "password");
  const school_name = formString(formData, "school_name");
  const grade = formString(formData, "grade");
  const daily_limit = formNumber(formData, "daily_limit");
  const pin = formString(formData, "pin");
  const initial_balance = formNumber(formData, "initial_balance");

  if (!name || !email || password.length < 6 || pin.length < 4) {
    actionMessage(parentPath, "error", "Nama, email, password child, dan PIN minimal 4 digit wajib diisi.");
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: "CHILD" }
  });

  if (createError || !created.user) throw new Error(createError?.message ?? "Gagal membuat akun child.");
  const child_user_id = created.user.id;

  const { error: profileError } = await admin.from("users").insert({
    id: child_user_id,
    name,
    email,
    password_hash: null,
    role: "CHILD",
    status: "active"
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(child_user_id);
    throw new Error(profileError.message);
  }

  const { data: child, error: childError } = await admin
    .from("children")
    .insert({
      parent_id: parent.id,
      user_id: child_user_id,
      name,
      school_name: school_name || null,
      grade: grade || null,
      daily_limit: Math.max(daily_limit, 0),
      pin_hash: hashPin(pin)
    })
    .select("id")
    .single();

  if (childError || !child) {
    await admin.auth.admin.deleteUser(child_user_id);
    throw new Error(childError?.message ?? "Gagal membuat child.");
  }

  const { error: walletError } = await admin.from("wallets").insert({
    child_id: child.id,
    balance: Math.max(initial_balance, 0)
  });

  if (walletError) throw new Error(walletError.message);

  await writeAudit(admin, profile.id, "create_child", "children", child.id, `Parent membuat akun anak ${name}.`);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "Anak berhasil dibuat.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function topUpChildAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const amount = formNumber(formData, "amount");
  if (!child_id || amount <= 0) throw new Error("Child dan nominal top up wajib valid.");

  const { profile, parent, admin } = await assertOwnChild(child_id);
  const { data: wallet, error: walletError } = await admin
    .from("wallets")
    .select("id,balance")
    .eq("child_id", child_id)
    .single();

  if (walletError || !wallet) throw new Error("Wallet child belum tersedia.");
  const balance = Number(wallet.balance) + amount;

  const { error: updateError } = await admin
    .from("wallets")
    .update({ balance, updated_at: new Date().toISOString() })
    .eq("id", wallet.id);

  if (updateError) throw new Error(updateError.message);

  await admin.from("topup_transactions").insert({
    parent_id: parent.id,
    child_id,
    order_id: `manual-${Date.now()}-${child_id.slice(0, 8)}`,
    amount,
    status: "settlement"
  });

  await writeAudit(admin, profile.id, "top_up_wallet", "wallets", wallet.id, `Top up simulasi sebesar ${amount}.`);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "Top-up simulasi berhasil.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function createMidtransTopupAction(formData: FormData) {
  try {
    const child_id = formString(formData, "child_id");
    const amount = formNumber(formData, "amount");
    if (!child_id || amount <= 0) throw new Error("Child dan nominal top-up wajib valid.");

    const { profile, parent, admin } = await assertOwnChild(child_id);
    const order_id = `KOIN-TOPUP-${Date.now()}-${randomUUID().slice(0, 8)}`;
    let midtrans_token: string | null = null;
    let midtrans_redirect_url: string | null = null;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) throw new Error("Midtrans Sandbox belum dikonfigurasi. Gunakan top-up manual atau isi environment variable.");

    const { data: createdTopup, error: insertError } = await admin
      .from("topup_transactions")
      .insert({
        parent_id: parent.id,
        child_id,
        order_id,
        amount,
        status: "pending"
      })
      .select("id")
      .single();

    if (insertError || !createdTopup) throw new Error(insertError?.message ?? "Gagal membuat top-up pending.");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const snapUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";
    const response = await fetch(snapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`
      },
      body: JSON.stringify({
        transaction_details: { order_id, gross_amount: amount },
        customer_details: { first_name: profile.name, email: profile.email },
        item_details: [{ id: child_id, price: amount, quantity: 1, name: "Top-up KOIN Sandbox" }],
        callbacks: {
          finish: `${appUrl}/dashboard/parent?success=Pembayaran%20Midtrans%20diproses.%20Saldo%20masuk%20setelah%20settlement.`,
          error: `${appUrl}/dashboard/parent?error=Pembayaran%20Midtrans%20gagal.`,
          pending: `${appUrl}/dashboard/parent?success=Pembayaran%20Midtrans%20masih%20pending.`
        }
      })
    });
    if (!response.ok) throw new Error("Gagal membuat transaksi Midtrans Sandbox.");
    const payload = await response.json() as { token?: string; redirect_url?: string };
    midtrans_token = payload.token ?? null;
    midtrans_redirect_url = payload.redirect_url ?? null;

    const { error } = await admin
      .from("topup_transactions")
      .update({ midtrans_token, midtrans_redirect_url, updated_at: new Date().toISOString() })
      .eq("id", createdTopup.id);
    if (error) throw new Error(error.message);
    revalidatePath(parentPath);

    if (midtrans_redirect_url) redirect(midtrans_redirect_url);
    actionMessage(parentPath, "success", "Top-up Midtrans Sandbox dibuat. Saldo bertambah setelah settlement atau simulasi sukses.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function simulateTopupSettlementAction(formData: FormData) {
  try {
    const topup_id = formString(formData, "topup_id");
    if (!topup_id) throw new Error("Top-up tidak valid.");

    const { profile, parent, admin } = await requireParentContext();
    const { data: topup } = await admin
      .from("topup_transactions")
      .select("id,parent_id,child_id,amount,status")
      .eq("id", topup_id)
      .eq("parent_id", parent.id)
      .single();
    if (!topup) throw new Error("Top-up tidak ditemukan.");
    if (topup.status !== "pending") throw new Error("Top-up ini tidak berstatus pending.");

    await settleTopupOnce({
      input: { topup_id: topup.id },
      actor_user_id: profile.id,
      audit_action: "TOPUP_SETTLEMENT_SIMULATION"
    });

    revalidatePath(parentPath);
    actionMessage(parentPath, "success", "Simulasi pembayaran sukses. Saldo anak bertambah.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function setDailyLimitAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const daily_limit = formNumber(formData, "daily_limit");
  const { profile, admin } = await assertOwnChild(child_id);

  const { error } = await admin
    .from("children")
    .update({ daily_limit: Math.max(daily_limit, 0) })
    .eq("id", child_id);

  if (error) throw new Error(error.message);
  await writeAudit(admin, profile.id, "set_daily_limit", "children", child_id, `Set daily_limit menjadi ${daily_limit}.`);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "daily_limit berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function requestCardAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const { profile, admin } = await assertOwnChild(child_id);
  await writeAudit(admin, profile.id, "REQUEST_CARD", "children", child_id, "Parent mengajukan kartu anak.");
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "Kartu berhasil diajukan.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function updateChildPinAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const pin = formString(formData, "pin");
  if (pin.length < 4) actionMessage(parentPath, "error", "PIN minimal 4 digit.");

  const { profile, admin } = await assertOwnChild(child_id);
  const { error } = await admin.from("children").update({ pin_hash: hashPin(pin) }).eq("id", child_id);
  if (error) throw new Error(error.message);

  await writeAudit(admin, profile.id, "update_child_pin", "children", child_id, "Parent mengubah PIN transaksi anak.");
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "PIN berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function updateCardStatusAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const card_id = formString(formData, "card_id");
  const status = formString(formData, "status");
  if (!card_id || !["blocked", "frozen"].includes(status)) throw new Error("Parent hanya bisa freeze/block kartu.");

  const { profile, admin } = await assertOwnChild(child_id);
  const { error } = await admin.from("cards").update({ status }).eq("id", card_id).eq("child_id", child_id);
  if (error) throw new Error(error.message);

  await writeAudit(admin, profile.id, "update_card_status", "cards", card_id, `Status kartu menjadi ${status}.`);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "Status kartu berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function createSavingsPocketAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const name = formString(formData, "name");
  const target_amount = formNumber(formData, "target_amount");
  const { admin } = await assertOwnChild(child_id);

  const { error } = await admin.from("savings_pockets").insert({
    child_id,
    name,
    target_amount: Math.max(target_amount, 0),
    current_amount: 0,
    status: "active"
  });

  if (error) throw new Error(error.message);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "Celengan berhasil dibuat.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function updateSavingRequestStatusAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const request_id = formString(formData, "request_id");
  const status = formString(formData, "status");
  if (!["approved", "rejected"].includes(status)) throw new Error("Status request tidak valid.");

  const { profile, parent, admin } = await assertOwnChild(child_id);
  if (status === "approved") {
    const { data: request } = await admin
      .from("saving_requests")
      .select("id,saving_pocket_id,amount")
      .eq("id", request_id)
      .eq("child_id", child_id)
      .eq("parent_id", parent.id)
      .single();
    if (!request) throw new Error("Saving request tidak ditemukan.");
    const { data: pocket } = await admin
      .from("savings_pockets")
      .select("id,current_amount")
      .eq("id", request.saving_pocket_id)
      .eq("child_id", child_id)
      .single();
    if (!pocket) throw new Error("Celengan tidak ditemukan.");
    if (Number(pocket.current_amount) < Number(request.amount)) throw new Error("Saldo celengan tidak cukup.");
    await admin
      .from("savings_pockets")
      .update({ current_amount: Number(pocket.current_amount) - Number(request.amount) })
      .eq("id", pocket.id);
  }
  const { error } = await admin
    .from("saving_requests")
    .update({ status })
    .eq("id", request_id)
    .eq("child_id", child_id)
    .eq("parent_id", parent.id);

  if (error) throw new Error(error.message);
  await writeAudit(admin, profile.id, "review_saving_request", "saving_requests", request_id, `Saving request ${status}.`);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", status === "approved" ? "Saving request disetujui orang tua." : "Saving request ditolak.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function createMissionAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const title = formString(formData, "title");
  const description = formString(formData, "description");
  const reward_amount = formNumber(formData, "reward_amount");
  const { parent, admin } = await assertOwnChild(child_id);

  const { error } = await admin.from("missions").insert({
    child_id,
    parent_id: parent.id,
    title,
    description,
    reward_amount: Math.max(reward_amount, 0),
    status: "pending"
  });

  if (error) throw new Error(error.message);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "Misi berhasil dibuat.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}

export async function approveMissionAction(formData: FormData) {
  try {
  const child_id = formString(formData, "child_id");
  const mission_id = formString(formData, "mission_id");
  const reward_amount = formNumber(formData, "reward_amount");
  const { profile, admin } = await assertOwnChild(child_id);

  const { data: wallet, error: walletError } = await admin.from("wallets").select("id,balance").eq("child_id", child_id).single();
  if (walletError || !wallet) throw new Error("Wallet anak tidak ditemukan.");

  await admin.from("wallets").update({ balance: Number(wallet.balance) + reward_amount, updated_at: new Date().toISOString() }).eq("id", wallet.id);
  const { error } = await admin.from("missions").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", mission_id).eq("child_id", child_id);
  if (error) throw new Error(error.message);

  await writeAudit(admin, profile.id, "approve_mission", "missions", mission_id, `Misi disetujui, reward ${reward_amount}.`);
  revalidatePath(parentPath);
  actionMessage(parentPath, "success", "Misi disetujui dan reward masuk saldo anak.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(parentPath, "error", friendlyError(error));
  }
}
