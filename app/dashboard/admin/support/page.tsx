import { reviewSupportReportAction } from "@/app/actions/support";
import { AppShell } from "@/components/AppShell";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { CsvExportButton } from "@/components/CsvExportButton";
import { DashboardNav } from "@/components/DashboardNav";
import { PageNotice } from "@/components/PageNotice";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/SubmitButton";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLinks } from "../nav";

type SupportReportRow = {
  id: string;
  reporter_user_id: string | null;
  related_transaction_id: string | null;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
  users?: { name?: string | null; email?: string | null; role?: string | null } | Array<{ name?: string | null; email?: string | null; role?: string | null }> | null;
};

type RelatedTransactionRow = {
  id: string;
  amount: number | string;
  status: string;
  failure_reason: string | null;
  created_at: string;
  children?: { name?: string | null } | Array<{ name?: string | null }> | null;
  canteens?: { canteen_name?: string | null } | Array<{ canteen_name?: string | null }> | null;
};

type RelatedItemRow = {
  id: string;
  transaction_id: string;
  qty: number | string;
  price: number | string;
  subtotal: number | string;
  products?: { name?: string | null } | Array<{ name?: string | null }> | null;
};

function first<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function AdminSupportPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string; status?: string; search?: string; from?: string; to?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  let query = createAdminClient()
    .from("support_reports")
    .select("id,reporter_user_id,related_transaction_id,subject,message,status,admin_reply,created_at,updated_at,users:reporter_user_id(name,email,role)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.status) query = query.eq("status", params.status);
  if (params.from) query = query.gte("created_at", `${params.from}T00:00:00.000Z`);
  if (params.to) query = query.lte("created_at", `${params.to}T23:59:59.999Z`);
  const { data } = await query;
  const admin = createAdminClient();
  const related_ids = Array.from(new Set(((data ?? []) as SupportReportRow[]).map((report) => report.related_transaction_id).filter(Boolean))) as string[];
  const [{ data: relatedTransactions }, { data: relatedItems }] = await Promise.all([
    related_ids.length
      ? admin.from("transactions").select("id,amount,status,failure_reason,created_at,children(name),canteens(canteen_name)").in("id", related_ids)
      : Promise.resolve({ data: [] }),
    related_ids.length
      ? admin.from("transaction_items").select("id,transaction_id,qty,price,subtotal,products(name)").in("transaction_id", related_ids)
      : Promise.resolve({ data: [] })
  ]);
  const transactionById = new Map(((relatedTransactions ?? []) as RelatedTransactionRow[]).map((transaction) => [transaction.id, transaction]));
  const itemsByTransactionId = new Map<string, RelatedItemRow[]>();
  ((relatedItems ?? []) as RelatedItemRow[]).forEach((item) => {
    const current = itemsByTransactionId.get(item.transaction_id) ?? [];
    current.push(item);
    itemsByTransactionId.set(item.transaction_id, current);
  });
  const search = (params.search ?? "").toLowerCase();
  const reports = ((data ?? []) as SupportReportRow[]).filter((report) => {
    if (!search) return true;
    const reporter = first(report.users);
    return [report.subject, report.message, report.admin_reply, reporter?.name, reporter?.email, reporter?.role].some((value) => String(value ?? "").toLowerCase().includes(search));
  });

  return (
    <AppShell user={user} title="Support Reports">
      <DashboardNav links={adminLinks} />
      <PageNotice error={params.error} success={params.success} />
      <form className="mb-4 grid gap-2 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_auto_auto]">
        <input className="field" name="search" placeholder="Cari subjek, pesan, reporter" defaultValue={params.search ?? ""} />
        <select className="field" name="status" defaultValue={params.status ?? ""}>
          <option value="">Semua status</option>
          <option value="open">open</option>
          <option value="in_review">in_review</option>
          <option value="resolved">resolved</option>
          <option value="rejected">rejected</option>
        </select>
        <input className="field" name="from" type="date" defaultValue={params.from ?? ""} />
        <input className="field" name="to" type="date" defaultValue={params.to ?? ""} />
        <button className="btn-secondary">Filter</button>
        <CsvExportButton
          filename="support-reports.csv"
          rows={reports.map((report) => {
            const reporter = first(report.users);
            return {
              created_at: formatDateTime(report.created_at),
              reporter: reporter?.name ?? reporter?.email ?? report.reporter_user_id,
              subject: report.subject,
              status: report.status,
              related_transaction_id: report.related_transaction_id,
              admin_reply: report.admin_reply
            };
          })}
        />
      </form>

      <div className="grid gap-4">
        {reports.map((report) => {
          const reporter = first(report.users);
          const transaction = report.related_transaction_id ? transactionById.get(report.related_transaction_id) : null;
          const transactionItems = report.related_transaction_id ? itemsByTransactionId.get(report.related_transaction_id) ?? [] : [];
          return (
            <article className="panel rounded-lg p-5" key={report.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">{report.subject}</h2>
                  <p className="text-sm text-ink/60">{reporter?.name ?? reporter?.email ?? report.reporter_user_id ?? "-"} - {reporter?.role ?? "-"} - {formatDateTime(report.created_at)}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
              <p className="mt-3 text-sm text-ink/75">{report.message}</p>
              {transaction ? (
                <div className="mt-4 rounded-md border border-line p-3 text-sm">
                  <p className="font-black">Transaksi terkait</p>
                  <div className="mt-2 grid gap-1 text-ink/70 md:grid-cols-2">
                    <p>Anak: <strong>{first(transaction.children)?.name ?? "-"}</strong></p>
                    <p>Kantin: <strong>{first(transaction.canteens)?.canteen_name ?? "-"}</strong></p>
                    <p>Total: <strong>{formatRupiah(Number(transaction.amount))}</strong></p>
                    <p>Status: <StatusBadge status={transaction.status} /></p>
                    <p>Waktu: <strong>{formatDateTime(transaction.created_at)}</strong></p>
                    <p>Alasan gagal: <strong>{transaction.failure_reason ?? "-"}</strong></p>
                  </div>
                  <div className="mt-3 divide-y divide-line">
                    {transactionItems.map((item) => (
                      <div className="grid gap-2 py-2 sm:grid-cols-4" key={item.id}>
                        <span>{first(item.products)?.name ?? "Produk"}</span>
                        <span>Qty {item.qty}</span>
                        <span>{formatRupiah(Number(item.price))}</span>
                        <strong>{formatRupiah(Number(item.subtotal))}</strong>
                      </div>
                    ))}
                    {transactionItems.length === 0 ? <p className="py-2 text-ink/60">Transaksi nominal manual.</p> : null}
                  </div>
                  <p className="mt-2 text-xs text-ink/50">ID transaksi: {transaction.id}</p>
                </div>
              ) : report.related_transaction_id ? <p className="mt-2 text-xs text-ink/55">Transaksi terkait: {report.related_transaction_id}</p> : null}
              {report.admin_reply ? <p className="mt-3 rounded-md bg-mint/20 p-3 text-sm text-ink/75">Balasan admin: {report.admin_reply}</p> : null}

              <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
              <form action={reviewSupportReportAction} className="grid gap-2 md:grid-cols-[0.7fr_1fr_auto]">
                <input type="hidden" name="report_id" value={report.id} />
                <select className="field" name="status" defaultValue={report.status}>
                  <option value="open">open</option>
                  <option value="in_review">in_review</option>
                  <option value="resolved">resolved</option>
                  <option value="rejected">rejected</option>
                </select>
                <input className="field" name="admin_reply" defaultValue={report.admin_reply ?? ""} placeholder="Balasan admin" />
                <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Simpan</SubmitButton>
              </form>
              <form action={reviewSupportReportAction}>
                <input type="hidden" name="report_id" value={report.id} />
                <input type="hidden" name="status" value="rejected" />
                <input type="hidden" name="admin_reply" value={report.admin_reply ?? "Laporan ditolak admin."} />
                <ConfirmSubmitButton className="btn-danger w-full" message="Yakin ingin menolak laporan ini?" pendingText="Menolak...">Tolak</ConfirmSubmitButton>
              </form>
              </div>
            </article>
          );
        })}
        {reports.length === 0 ? <p className="panel rounded-lg p-6 text-sm text-ink/60">Tidak ada laporan sesuai filter.</p> : null}
      </div>
    </AppShell>
  );
}
