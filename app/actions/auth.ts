"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { dashboardPathForRole } from "@/lib/auth";
import { formString } from "@/lib/format";
import type { Role } from "@/lib/types";

function withError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function registerPublicUser(formData: FormData, role: Extract<Role, "PARENT" | "CANTEEN">) {
  const email = formString(formData, "email").toLowerCase();
  const password = formString(formData, "password");
  const name = formString(formData, "name");
  const phone = formString(formData, "phone");
  const canteen_name = formString(formData, "canteen_name");
  const owner_name = formString(formData, "owner_name") || name;
  const school_name = formString(formData, "school_name");
  const address_optional = formString(formData, "address_optional");
  const has_nfc_device = formData.get("has_nfc_device") === "on";
  const path = role === "PARENT" ? "/register/parent" : "/register/canteen";

  if (!email || !password || !name) withError(path, "Nama, email, dan password wajib diisi.");
  if (password.length < 6) withError(path, "Password minimal 6 karakter.");

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name, role }
  });

  if (createError || !created.user) withError(path, createError?.message ?? "Gagal membuat akun.");
  const user_id = created.user.id;

  const { error: profileError } = await admin.from("users").insert({
    id: user_id,
    name,
    email,
    password_hash: null,
    role,
    status: "active"
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(user_id);
    withError(path, profileError.message);
  }

  if (role === "PARENT") {
    const { error } = await admin.from("parents").insert({
      user_id,
      phone,
      address_optional: address_optional || null
    });
    if (error) {
      await admin.auth.admin.deleteUser(user_id);
      withError(path, error.message);
    }
  }

  if (role === "CANTEEN") {
    const { error } = await admin
      .from("canteens")
      .insert({
        user_id,
        canteen_name: canteen_name || name,
        owner_name,
        school_name: school_name || null,
        phone,
        has_nfc_device,
        status: "pending"
      });
    if (error) {
      await admin.auth.admin.deleteUser(user_id);
      withError(path, error.message);
    }
  }

  redirect(`/login?success=${encodeURIComponent("Akun berhasil dibuat. Silakan login.")}`);
}

export async function registerParentAction(formData: FormData) {
  await registerPublicUser(formData, "PARENT");
}

export async function registerCanteenAction(formData: FormData) {
  await registerPublicUser(formData, "CANTEEN");
}

export async function loginAction(formData: FormData) {
  const email = formString(formData, "email").toLowerCase();
  const password = formString(formData, "password");
  const supabase = await createClient();
  const { data: loginData, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) withError("/login", error.message);

  if (!loginData.session) {
    withError("/login", "Login gagal membuat sesi.");
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: loginData.session.access_token,
    refresh_token: loginData.session.refresh_token
  });

  if (sessionError) {
    withError("/login", sessionError.message);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) withError("/login", "Login gagal.");

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role,status")
    .eq("id", user.id)
    .eq("status", "active")
    .single();

  if (profileError || !profile) withError("/login", "Profil belum tersedia atau belum aktif.");
  redirect(dashboardPathForRole(profile.role as Role));
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
