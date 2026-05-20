import { AppShell } from "@/components/AppShell";
import { DashboardNav } from "@/components/DashboardNav";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLinks } from "../nav";

export default async function AdminUsersPage() {
  const user = await requireUser(["ADMIN"]);
  const { data } = await createAdminClient()
    .from("users")
    .select("id,name,email,password_hash,role,status,created_at")
    .order("created_at", { ascending: false });

  return (
    <AppShell user={user} title="Admin Users">
      <DashboardNav links={adminLinks} />
      <div className="panel overflow-x-auto rounded-lg p-5">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-line"><th className="py-2">name</th><th>email</th><th>role</th><th>status</th><th>created_at</th></tr></thead><tbody>{(data ?? []).map((item) => <tr className="border-b border-line" key={item.id}><td className="py-2">{item.name}</td><td>{item.email}</td><td>{item.role}</td><td>{item.status}</td><td>{item.created_at}</td></tr>)}</tbody></table>
      </div>
    </AppShell>
  );
}
