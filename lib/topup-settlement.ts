import { createAdminClient } from "./supabase/admin";

type SettlementInput =
  | { topup_id: string; order_id?: never }
  | { order_id: string; topup_id?: never };

export async function settleTopupOnce({
  input,
  actor_user_id,
  audit_action = "TOPUP_SETTLEMENT"
}: {
  input: SettlementInput;
  actor_user_id?: string | null;
  audit_action?: string;
}) {
  const admin = createAdminClient();
  const selector = input.topup_id ? { column: "id", value: input.topup_id } : { column: "order_id", value: input.order_id };

  const { data: pendingTopup, error: selectError } = await admin
    .from("topup_transactions")
    .select("id,parent_id,child_id,order_id,amount,status")
    .eq(selector.column, selector.value)
    .single();

  if (selectError || !pendingTopup) throw new Error("Top-up tidak ditemukan.");
  if (pendingTopup.status === "settlement") return { settled: false, message: "Top-up sudah settlement.", topup: pendingTopup };
  if (pendingTopup.status !== "pending") throw new Error(`Top-up berstatus ${pendingTopup.status}, saldo tidak diubah.`);

  const { data: updated, error: updateTopupError } = await admin
    .from("topup_transactions")
    .update({ status: "settlement", updated_at: new Date().toISOString() })
    .eq("id", pendingTopup.id)
    .eq("status", "pending")
    .select("id,parent_id,child_id,order_id,amount,status")
    .single();

  if (updateTopupError || !updated) return { settled: false, message: "Top-up sudah diproses.", topup: pendingTopup };

  const { data: wallet, error: walletError } = await admin.from("wallets").select("id,balance").eq("child_id", updated.child_id).single();
  if (walletError || !wallet) throw new Error("Wallet anak tidak ditemukan.");

  const { error: walletUpdateError } = await admin
    .from("wallets")
    .update({ balance: Number(wallet.balance) + Number(updated.amount), updated_at: new Date().toISOString() })
    .eq("id", wallet.id);

  if (walletUpdateError) throw new Error(walletUpdateError.message);

  await admin.from("audit_logs").insert({
    actor_user_id: actor_user_id ?? null,
    action: audit_action,
    entity_type: "topup_transactions",
    entity_id: updated.id,
    description: `Top-up ${updated.order_id} settlement sebesar ${updated.amount}.`
  });

  return { settled: true, message: "Top-up berhasil settlement.", topup: updated };
}

export async function markTopupStatusByOrderId(order_id: string, status: "failed" | "expired" | "cancelled") {
  const admin = createAdminClient();
  const { error } = await admin
    .from("topup_transactions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("order_id", order_id)
    .eq("status", "pending");

  if (error) throw new Error(error.message);
}
