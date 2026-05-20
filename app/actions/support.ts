"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionMessage, friendlyError, rethrowRedirect } from "@/lib/action-result";
import { getCurrentUserProfile } from "@/lib/auth";
import { formString } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

const rolePaths = {
  ADMIN: "/dashboard/admin/support",
  PARENT: "/dashboard/parent",
  CHILD: "/dashboard/child",
  CANTEEN: "/dashboard/canteen"
} as const;

async function getProfile() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");
  return profile;
}

async function assertRelatedTransaction(admin: ReturnType<typeof createAdminClient>, reporter_user_id: string, role: string, transaction_id: string) {
  if (!transaction_id) return null;

  if (role === "CHILD") {
    const { data: child } = await admin.from("children").select("id").eq("user_id", reporter_user_id).single();
    if (!child) throw new Error("Profil anak tidak ditemukan.");
    const { data: transaction } = await admin.from("transactions").select("id").eq("id", transaction_id).eq("child_id", child.id).single();
    if (!transaction) throw new Error("Transaksi tidak ditemukan untuk akun ini.");
    return transaction.id;
  }

  if (role === "PARENT") {
    const { data: parent } = await admin.from("parents").select("id").eq("user_id", reporter_user_id).single();
    if (!parent) throw new Error("Profil parent tidak ditemukan.");
    const { data: children } = await admin.from("children").select("id").eq("parent_id", parent.id);
    const child_ids = (children ?? []).map((child) => child.id);
    if (child_ids.length === 0) throw new Error("Belum ada anak untuk transaksi ini.");
    const { data: transaction } = await admin.from("transactions").select("id").eq("id", transaction_id).in("child_id", child_ids).single();
    if (!transaction) throw new Error("Transaksi tidak ditemukan untuk parent ini.");
    return transaction.id;
  }

  if (role === "CANTEEN") {
    const { data: canteen } = await admin.from("canteens").select("id").eq("user_id", reporter_user_id).single();
    if (!canteen) throw new Error("Profil kantin tidak ditemukan.");
    const { data: transaction } = await admin.from("transactions").select("id").eq("id", transaction_id).eq("canteen_id", canteen.id).single();
    if (!transaction) throw new Error("Transaksi tidak ditemukan untuk kantin ini.");
    return transaction.id;
  }

  return null;
}

export async function createSupportReportAction(formData: FormData) {
  const profile = await getProfile();
  const path = rolePaths[profile.role] ?? "/dashboard";

  try {
    if (!["PARENT", "CHILD", "CANTEEN"].includes(profile.role)) {
      throw new Error("Role ini tidak bisa membuat laporan.");
    }

    const subject = formString(formData, "subject");
    const message = formString(formData, "message");
    const related_transaction_id = formString(formData, "related_transaction_id");
    if (!subject || !message) throw new Error("Subjek dan pesan wajib diisi.");

    const admin = createAdminClient();
    const verified_transaction_id = await assertRelatedTransaction(admin, profile.id, profile.role, related_transaction_id);
    const { error } = await admin.from("support_reports").insert({
      reporter_user_id: profile.id,
      related_transaction_id: verified_transaction_id,
      subject,
      message,
      status: "open"
    });

    if (error) throw new Error(error.message);
    revalidatePath(path);
    actionMessage(path, "success", "Laporan berhasil dikirim ke admin.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(path, "error", friendlyError(error));
  }
}

export async function reviewSupportReportAction(formData: FormData) {
  try {
    const profile = await getProfile();
    if (profile.role !== "ADMIN") redirect("/dashboard");

    const report_id = formString(formData, "report_id");
    const status = formString(formData, "status");
    const admin_reply = formString(formData, "admin_reply");
    if (!report_id || !["open", "in_review", "resolved", "rejected"].includes(status)) {
      throw new Error("Status laporan tidak valid.");
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("support_reports")
      .update({ status, admin_reply: admin_reply || null, updated_at: new Date().toISOString() })
      .eq("id", report_id);

    if (error) throw new Error(error.message);
    await admin.from("audit_logs").insert({
      actor_user_id: profile.id,
      action: "review_support_report",
      entity_type: "support_reports",
      entity_id: report_id,
      description: `Admin mengubah laporan menjadi ${status}.`
    });

    revalidatePath("/dashboard/admin/support");
    actionMessage("/dashboard/admin/support", "success", "Laporan berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage("/dashboard/admin/support", "error", friendlyError(error));
  }
}
