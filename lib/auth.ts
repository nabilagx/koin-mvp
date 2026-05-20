import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppUser, Role } from "@/lib/types";

export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,password_hash,role,status,created_at")
    .eq("id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;

  return data as AppUser;
}

export async function requireUser(allowedRoles?: Role[]) {
  const profile = await getCurrentUserProfile();

  if (!profile) redirect("/login");

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return profile;
}

export function dashboardPathForRole(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "PARENT":
      return "/dashboard/parent";
    case "CHILD":
      return "/dashboard/child";
    case "CANTEEN":
      return "/dashboard/canteen";
  }
}
