import { AppShell } from "@/components/AppShell";
import { DashboardNav } from "@/components/DashboardNav";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLinks } from "../nav";

export default async function AdminParentsPage() {
  const user = await requireUser(["ADMIN"]);
  const { data } = await createAdminClient()
    .from("parents")
    .select("id,user_id,phone,address_optional,created_at,users:user_id(name,email)")
    .order("created_at", { ascending: false });

  return (
    <AppShell user={user} title="Admin Parents">
      <DashboardNav links={adminLinks} />
      <div className="grid gap-3">{(data ?? []).map((item) => {
        const profile = Array.isArray(item.users) ? item.users[0] : item.users;
        return <div className="panel rounded-lg p-4 text-sm" key={item.id}><p className="font-black">{profile?.name ?? item.user_id}</p><p>{profile?.email} · {item.phone ?? "-"} · {item.address_optional ?? "-"}</p></div>;
      })}</div>
    </AppShell>
  );
}
