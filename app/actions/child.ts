"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { formNumber, formString } from "@/lib/format";
import { actionMessage, friendlyError, rethrowRedirect } from "@/lib/action-result";
import { getDailyLimitUsage } from "@/lib/limits";
import { createAdminClient } from "@/lib/supabase/admin";

const childPath = "/dashboard/child";

async function requireChildContext() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "CHILD") redirect("/dashboard");

  const admin = createAdminClient();
  const { data: child, error } = await admin
    .from("children")
    .select("id,parent_id,user_id")
    .eq("user_id", profile.id)
    .single();

  if (error || !child) throw new Error("Profil anak belum tersedia.");
  return { profile, child, admin };
}

export async function createChildSavingsPocketAction(formData: FormData) {
  try {
  const { child, admin } = await requireChildContext();
  const name = formString(formData, "name");
  const target_amount = formNumber(formData, "target_amount");
  if (!name) throw new Error("Nama celengan wajib diisi.");

  const { error } = await admin.from("savings_pockets").insert({
    child_id: child.id,
    name,
    target_amount: Math.max(target_amount, 0),
    current_amount: 0,
    status: "active"
  });

  if (error) throw new Error(error.message);
  revalidatePath(childPath);
  actionMessage(childPath, "success", "Celengan berhasil dibuat.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(childPath, "error", friendlyError(error));
  }
}

export async function moveWalletToSavingsAction(formData: FormData) {
  try {
  const { child, admin } = await requireChildContext();
  const saving_pocket_id = formString(formData, "saving_pocket_id");
  const amount = formNumber(formData, "amount");
  if (!saving_pocket_id || amount <= 0) throw new Error("Celengan dan nominal wajib valid.");

  const { data: childLimit, error: childLimitError } = await admin
    .from("children")
    .select("id,daily_limit")
    .eq("id", child.id)
    .single();
  if (childLimitError || !childLimit) throw new Error("Profil anak belum lengkap.");

  const usage = await getDailyLimitUsage(admin, child.id, childLimit.daily_limit);
  const remaining_limit = usage.remaining_today;
  if (amount > remaining_limit) throw new Error("Nominal tabungan melebihi sisa limit harian.");

  const { data: wallet, error: walletError } = await admin
    .from("wallets")
    .select("id,balance")
    .eq("child_id", child.id)
    .single();

  if (walletError || !wallet) throw new Error("Wallet belum tersedia.");
  if (Number(wallet.balance) < amount) throw new Error("Saldo tidak cukup.");

  const { data: pocket, error: pocketError } = await admin
    .from("savings_pockets")
    .select("id,current_amount")
    .eq("id", saving_pocket_id)
    .eq("child_id", child.id)
    .single();

  if (pocketError || !pocket) throw new Error("Celengan tidak ditemukan.");

  const { error: movementError } = await admin.from("saving_movements").insert({
    child_id: child.id,
    saving_pocket_id: pocket.id,
    amount,
    type: "deposit"
  });
  if (movementError) throw new Error(movementError.message);

  await admin
    .from("wallets")
    .update({ balance: Number(wallet.balance) - amount, updated_at: new Date().toISOString() })
    .eq("id", wallet.id);

  await admin
    .from("savings_pockets")
    .update({ current_amount: Number(pocket.current_amount) + amount })
    .eq("id", pocket.id);

  revalidatePath(childPath);
  actionMessage(childPath, "success", "Saldo berhasil dipindahkan ke celengan.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(childPath, "error", friendlyError(error));
  }
}

export async function createSavingRequestAction(formData: FormData) {
  try {
  const { child, admin } = await requireChildContext();
  const saving_pocket_id = formString(formData, "saving_pocket_id");
  const amount = formNumber(formData, "amount");
  const reason = formString(formData, "reason");
  const payout_destination_type = formString(formData, "payout_destination_type") || "Minta orang tua transfer";

  const { error } = await admin.from("saving_requests").insert({
    saving_pocket_id,
    child_id: child.id,
    parent_id: child.parent_id,
    amount,
    reason,
    status: "pending",
    payout_destination_type
  });

  if (error) throw new Error(error.message);
  revalidatePath(childPath);
  actionMessage(childPath, "success", "Saving request berhasil diajukan.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(childPath, "error", friendlyError(error));
  }
}

export async function submitMissionAction(formData: FormData) {
  try {
    const { child, admin } = await requireChildContext();
    const mission_id = formString(formData, "mission_id");
    const evidence_text = formString(formData, "evidence_text");
    const evidence_url = formString(formData, "evidence_url");
    const { error } = await admin
      .from("missions")
      .update({
        evidence_text: evidence_text || null,
        evidence_url: evidence_url || null,
        submitted_at: new Date().toISOString(),
        status: "completed"
      })
      .eq("id", mission_id)
      .eq("child_id", child.id);

    if (error) throw new Error(error.message);
    revalidatePath(childPath);
    actionMessage(childPath, "success", "Misi berhasil disubmit.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(childPath, "error", friendlyError(error));
  }
}
