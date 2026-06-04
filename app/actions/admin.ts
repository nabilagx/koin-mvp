"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import { formNumber, formString } from "@/lib/format";
import { hashPin } from "@/lib/pin";
import { actionMessage, friendlyError, getReturnTo, rethrowRedirect } from "@/lib/action-result";
import { createAdminClient } from "@/lib/supabase/admin";

const adminCardsPath = "/dashboard/admin/cards";
const adminChildrenPath = "/dashboard/admin/children";
const adminCanteensPath = "/dashboard/admin/canteens";

export type RewriteCardInput = {
  old_card_uid?: string;
  new_card_uid: string;
  child_id: string;
  card_label?: string;
  status?: string;
  confirmed?: boolean;
  write_confirmed?: boolean;
};

export type RewriteCardResult = {
  ok: boolean;
  message: string;
  needs_confirmation?: boolean;
};

async function requireAdminContext() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "ADMIN" || profile.status !== "active") redirect("/dashboard");
  return { profile, admin: createAdminClient() };
}

async function audit(action: string, entity_type: string, entity_id: string | null, description: string) {
  const { profile, admin } = await requireAdminContext();
  await admin.from("audit_logs").insert({
    actor_user_id: profile.id,
    action,
    entity_type,
    entity_id,
    description
  });
}

export async function updateAdminCardStatusAction(formData: FormData) {
  const returnTo = getReturnTo(formData, adminCardsPath);
  try {
  const card_id = formString(formData, "card_id");
  const status = formString(formData, "status");
  if (!card_id || !["active", "blocked", "frozen", "replaced"].includes(status)) throw new Error("Status kartu tidak valid.");

  const { admin } = await requireAdminContext();
  const { error } = await admin.from("cards").update({ status }).eq("id", card_id);
  if (error) throw new Error(error.message);

  await audit("update_card_status", "cards", card_id, `Admin mengubah status kartu menjadi ${status}.`);
  revalidatePath(adminCardsPath);
  actionMessage(returnTo, "success", "Status kartu berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}

export async function updateCanteenStatusAction(formData: FormData) {
  const returnTo = getReturnTo(formData, adminCanteensPath);
  try {
  const canteen_id = formString(formData, "canteen_id");
  const status = formString(formData, "status");
  if (!canteen_id || !["active", "pending", "suspended"].includes(status)) throw new Error("Status kantin tidak valid.");

  const { admin } = await requireAdminContext();
  const { error } = await admin.from("canteens").update({ status }).eq("id", canteen_id);
  if (error) throw new Error(error.message);

  await audit("update_canteen_status", "canteens", canteen_id, `Admin mengubah status kantin menjadi ${status}.`);
  revalidatePath(adminCanteensPath);
  actionMessage(returnTo, "success", "Status kantin berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}

export async function assignAdminCardAction(formData: FormData) {
  const returnTo = getReturnTo(formData, adminCardsPath);
  try {
  const child_id = formString(formData, "child_id");
  const card_uid = formString(formData, "card_uid");
  const card_label = formString(formData, "card_label");
  const status = formString(formData, "status") || "active";
  if (!child_id || !card_uid || !["active", "frozen", "blocked", "replaced"].includes(status)) throw new Error("Data kartu tidak valid.");

  const { admin } = await requireAdminContext();
  const { data: existing } = await admin.from("cards").select("id").eq("child_id", child_id).maybeSingle();
  const payload = { child_id, card_uid, card_label: card_label || null, status };
  const { error } = existing
    ? await admin.from("cards").update(payload).eq("id", existing.id)
    : await admin.from("cards").insert(payload);
  if (error) throw new Error(error.message);

  await audit("assign_card", "cards", existing?.id ?? null, `Admin assign kartu ${card_uid}.`);
  revalidatePath(adminCardsPath);
  actionMessage(returnTo, "success", "Kartu berhasil di-assign.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}

export async function rewriteCardAction(input: RewriteCardInput): Promise<RewriteCardResult> {
  try {
    const old_card_uid = (input.old_card_uid ?? "").trim();
    const new_card_uid = input.new_card_uid.trim();
    const child_id = input.child_id.trim();
    const card_label = (input.card_label ?? "").trim();
    const status = input.status || "active";
    if (!child_id || !new_card_uid || !["active", "frozen", "blocked", "replaced"].includes(status)) {
      return { ok: false, message: "Data kartu tidak valid." };
    }

    const { profile, admin } = await requireAdminContext();
    const { data: targetChild } = await admin.from("children").select("id,name").eq("id", child_id).single();
    if (!targetChild) return { ok: false, message: "Anak tujuan tidak ditemukan." };

    const { data: oldCard } = old_card_uid
      ? await admin
        .from("cards")
        .select("id,child_id,card_uid,card_label,status,children(name)")
        .eq("card_uid", old_card_uid)
        .maybeSingle()
      : { data: null };

    const { data: newUidCard } = await admin
      .from("cards")
      .select("id,child_id,card_uid,status,children(name)")
      .eq("card_uid", new_card_uid)
      .maybeSingle();

    const oldCardId = oldCard?.id ?? null;
    if (newUidCard && newUidCard.id !== oldCardId) {
      const owner = Array.isArray(newUidCard.children) ? newUidCard.children[0] : newUidCard.children;
      if (newUidCard.status === "active" && newUidCard.child_id !== child_id) {
        return { ok: false, message: "UID kartu sudah digunakan oleh kartu aktif lain." };
      }
      if (newUidCard.child_id !== child_id) {
        return { ok: false, message: `UID kartu sudah ada di database untuk ${owner?.name ?? "anak lain"}. Gunakan UID lain atau scan kartu yang benar.` };
      }
    }

    if (oldCard && oldCard.child_id !== child_id && !input.confirmed) {
      const owner = Array.isArray(oldCard.children) ? oldCard.children[0] : oldCard.children;
      return {
        ok: false,
        needs_confirmation: true,
        message: `Kartu ini sebelumnya terhubung ke ${owner?.name ?? "anak lain"}. Yakin ingin memindahkan kartu?`
      };
    }

    if (!input.write_confirmed) {
      return { ok: true, message: "Validasi berhasil. Silakan tulis kartu NFC lalu sinkronkan database." };
    }

    const payload = { child_id, card_uid: new_card_uid, card_label: card_label || null, status };
    let changedCardId: string | null = null;
    let action = "REWRITE_NFC_CARD";

    if (oldCard && oldCard.child_id === child_id) {
      const { error } = await admin.from("cards").update(payload).eq("id", oldCard.id);
      if (error) return { ok: false, message: error.message };
      changedCardId = oldCard.id;
    } else {
      if (oldCard && oldCard.child_id !== child_id) {
        const { error: replaceError } = await admin.from("cards").update({ status: "replaced" }).eq("id", oldCard.id);
        if (replaceError) return { ok: false, message: replaceError.message };
        action = "REASSIGN_NFC_CARD";
      }

      const { data: existingForChild } = await admin
        .from("cards")
        .select("id")
        .eq("child_id", child_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingForChild) {
        const { error } = await admin.from("cards").update(payload).eq("id", existingForChild.id);
        if (error) return { ok: false, message: error.message };
        changedCardId = existingForChild.id;
      } else {
        const { data: inserted, error } = await admin.from("cards").insert(payload).select("id").single();
        if (error) return { ok: false, message: error.message };
        changedCardId = inserted.id;
      }
    }

    await admin.from("audit_logs").insert({
      actor_user_id: profile.id,
      action,
      entity_type: "cards",
      entity_id: changedCardId,
      description: `${action}: ${old_card_uid || "-"} -> ${new_card_uid} untuk ${targetChild.name}.`
    });
    revalidatePath(adminCardsPath);

    return { ok: true, message: "Kartu berhasil ditulis dan database berhasil diperbarui." };
  } catch (error) {
    return { ok: false, message: friendlyError(error) };
  }
}

export async function resetChildPinAction(formData: FormData) {
  const returnTo = getReturnTo(formData, adminChildrenPath);
  try {
    const child_id = formString(formData, "child_id");
    const pin = formString(formData, "pin");
    if (!child_id || pin.length < 4) throw new Error("PIN minimal 4 digit.");
    const { admin } = await requireAdminContext();
    const { error } = await admin.from("children").update({ pin_hash: hashPin(pin) }).eq("id", child_id);
    if (error) throw new Error(error.message);
    await audit("RESET_CHILD_PIN", "children", child_id, "Admin reset PIN transaksi anak.");
    revalidatePath(adminChildrenPath);
    actionMessage(returnTo, "success", "PIN anak berhasil direset.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}

export async function updateAdminChildProfileAction(formData: FormData) {
  const returnTo = getReturnTo(formData, adminChildrenPath);
  try {
    const child_id = formString(formData, "child_id");
    const name = formString(formData, "name");
    const school_name = formString(formData, "school_name");
    const grade = formString(formData, "grade");
    const daily_limit = formNumber(formData, "daily_limit");
    if (!child_id || !name) throw new Error("Nama anak wajib diisi.");

    const { admin } = await requireAdminContext();
    const { data: child } = await admin.from("children").select("id,user_id").eq("id", child_id).single();
    if (!child) throw new Error("Anak tidak ditemukan.");

    const { error } = await admin
      .from("children")
      .update({
        name,
        school_name: school_name || null,
        grade: grade || null,
        daily_limit: Math.max(daily_limit, 0)
      })
      .eq("id", child_id);

    if (error) throw new Error(error.message);
    await admin.from("users").update({ name }).eq("id", child.user_id);
    await audit("ADMIN_UPDATE_CHILD_PROFILE", "children", child_id, `Admin memperbarui profil anak ${name}.`);
    revalidatePath(adminChildrenPath);
    actionMessage(returnTo, "success", "Identitas anak berhasil diperbarui.");
  } catch (error) {
    rethrowRedirect(error);
    actionMessage(returnTo, "error", friendlyError(error));
  }
}
