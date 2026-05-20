import { redirect } from "next/navigation";
import { dashboardPathForRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

export default async function DashboardIndexPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("users")
    .select("role,status")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.status !== "active") redirect("/login");

  redirect(dashboardPathForRole(profile.role as Role));
}
