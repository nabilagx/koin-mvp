import { AppShell } from "@/components/AppShell";
import { CsvExportButton } from "@/components/CsvExportButton";
import { StatusBadge } from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

type TopupRow = {
  id: string;
  parent_id: string | null;
  child_id: string | null;
  order_id: string;
  amount: number | string;
  status: string;
  created_at: string;
  parents?: { users?: { name?: string | null; email?: string | null } | Array<{ name?: string | null; email?: string | null }> | null } | Array<{ users?: { name?: string | null; email?: string | null } | Array<{ name?: string | null; email?: string | null }> | null }> | null;
  children?: { name?: string | null } | Array<{ name?: string | null }> | null;
};

function first<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function AdminTopupsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; search?: string; from?: string; to?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  let query = createAdminClient()
    .from("topup_transactions")
    .select("id,parent_id,child_id,order_id,amount,status,created_at,parents(users:user_id(name,email)),children(name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (params.status) query = query.eq("status", params.status);
  if (params.from) query = query.gte("created_at", `${params.from}T00:00:00.000Z`);
  if (params.to) query = query.lte("created_at", `${params.to}T23:59:59.999Z`);
  const { data } = await query;
  const search = (params.search ?? "").toLowerCase();
  const topups = ((data ?? []) as TopupRow[]).filter((item) => {
    const parent = first(item.parents);
    const parentUser = first(parent?.users);
    const child = first(item.children);
    if (!search) return true;
    return [parentUser?.name, parentUser?.email, child?.name, item.order_id, item.status].some((value) => String(value ?? "").toLowerCase().includes(search));
  });

  return (
    <AppShell user={user} title="Admin Top-ups">
      <form className="mb-4 grid gap-2 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_auto_auto]">
        <input className="field" name="search" placeholder="Cari parent, anak, order_id" defaultValue={params.search ?? ""} />
        <select className="field" name="status" defaultValue={params.status ?? ""}>
          <option value="">Semua status</option>
          <option value="pending">pending</option>
          <option value="settlement">settlement</option>
          <option value="failed">failed</option>
          <option value="expired">expired</option>
          <option value="cancelled">cancelled</option>
        </select>
        <input className="field" name="from" type="date" defaultValue={params.from ?? ""} />
        <input className="field" name="to" type="date" defaultValue={params.to ?? ""} />
        <button className="btn-secondary">Filter</button>
        <CsvExportButton
          filename="topups.csv"
          rows={topups.map((item) => {
            const parent = first(item.parents);
            const parentUser = first(parent?.users);
            const child = first(item.children);
            return {
              created_at: formatDateTime(item.created_at),
              parent: parentUser?.name,
              parent_email: parentUser?.email,
              child: child?.name,
              amount: item.amount,
              status: item.status,
              order_id: item.order_id
            };
          })}
        />
      </form>
      <div className="grid gap-3">
        {topups.map((item) => {
          const parent = first(item.parents);
          const parentUser = first(parent?.users);
          const child = first(item.children);
          return (
            <div className="panel rounded-lg p-4 text-sm" key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-black">{String(item.order_id).startsWith("manual-") ? "Manual demo" : "Midtrans Sandbox"} - {formatRupiah(Number(item.amount))}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-2">{parentUser?.name ?? "-"} ({parentUser?.email ?? "-"}) - {child?.name ?? "-"}</p>
              <p className="text-xs text-ink/55">{formatDateTime(item.created_at)} - {item.order_id}</p>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
