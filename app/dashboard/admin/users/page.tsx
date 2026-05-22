import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { formatRole } from "@/lib/labels";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminUsersPage() {
  const user = await requireUser(["ADMIN"]);
  const { data } = await createAdminClient()
    .from("users")
    .select("id,name,email,password_hash,role,status,created_at")
    .order("created_at", { ascending: false });

  return (
    <AppShell user={user} title="Data Pengguna">
      <div className="panel overflow-x-auto rounded-lg p-5">
        <table className="w-full text-left text-sm"><thead><tr className="border-b border-line"><th className="py-2">Nama</th><th>Email</th><th>Peran</th><th>Status</th><th>Waktu Dibuat</th></tr></thead><tbody>{(data ?? []).map((item) => <tr className="border-b border-line" key={item.id}><td className="py-2">{item.name}</td><td>{item.email}</td><td>{formatRole(item.role)}</td><td><StatusBadge status={item.status} /></td><td>{formatDateTime(item.created_at)}</td></tr>)}</tbody></table>
      </div>
    </AppShell>
  );
}
