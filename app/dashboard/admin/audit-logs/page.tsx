import { AppShell } from "@/components/AppShell";
import { DashboardNav } from "@/components/DashboardNav";
import { CsvExportButton } from "@/components/CsvExportButton";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLinks } from "../nav";

type AuditLogRow = {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string | null;
  created_at: string;
  users?: { name?: string | null; email?: string | null } | Array<{ name?: string | null; email?: string | null }> | null;
};

function first<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function AdminAuditLogsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; action?: string; entity_type?: string; from?: string; to?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  let query = createAdminClient()
    .from("audit_logs")
    .select("id,actor_user_id,action,entity_type,entity_id,description,created_at,users:actor_user_id(name,email)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.action) query = query.ilike("action", `%${params.action}%`);
  if (params.entity_type) query = query.ilike("entity_type", `%${params.entity_type}%`);
  if (params.from) query = query.gte("created_at", `${params.from}T00:00:00.000Z`);
  if (params.to) query = query.lte("created_at", `${params.to}T23:59:59.999Z`);
  const { data } = await query;
  const search = (params.search ?? "").toLowerCase();
  const logs = ((data ?? []) as AuditLogRow[]).filter((item) => {
    if (!search) return true;
    const actor = first(item.users);
    return [actor?.name, actor?.email, item.action, item.entity_type, item.entity_id, item.description].some((value) => String(value ?? "").toLowerCase().includes(search));
  });

  return (
    <AppShell user={user} title="Admin Audit Logs">
      <DashboardNav links={adminLinks} />
      <form className="mb-4 grid gap-2 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_auto_auto]">
        <input className="field" name="search" placeholder="Cari actor/action/deskripsi" defaultValue={params.search ?? ""} />
        <input className="field" name="action" placeholder="Action" defaultValue={params.action ?? ""} />
        <input className="field" name="entity_type" placeholder="entity_type" defaultValue={params.entity_type ?? ""} />
        <input className="field" name="from" type="date" defaultValue={params.from ?? ""} />
        <input className="field" name="to" type="date" defaultValue={params.to ?? ""} />
        <button className="btn-secondary">Filter</button>
        <CsvExportButton filename="audit-logs.csv" rows={logs.map((item) => {
          const actor = first(item.users);
          return {
            created_at: formatDateTime(item.created_at),
            actor: actor?.name ?? actor?.email ?? item.actor_user_id,
            action: item.action,
            entity_type: item.entity_type,
            entity_id: item.entity_id,
            description: item.description
          };
        })} />
      </form>
      <div className="grid gap-3">
        {logs.map((item) => {
          const actor = first(item.users);
          return <div className="panel rounded-lg p-4 text-sm" key={item.id}><p className="font-black">{item.action} - {item.entity_type}</p><p>{item.description}</p><p className="text-ink/55">{actor?.name ?? actor?.email ?? item.actor_user_id ?? "-"} - {formatDateTime(item.created_at)}</p></div>;
        })}
      </div>
    </AppShell>
  );
}
