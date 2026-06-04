import { createSupportReportAction } from "@/app/actions/support";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { formatStatus } from "@/lib/labels";
import { ReturnToInput } from "./ReturnToInput";
import { SubmitButton } from "./SubmitButton";

type SupportTransaction = {
  id: string;
  amount: number | string;
  status: string;
  created_at: string;
  canteens?: { canteen_name?: string | null } | Array<{ canteen_name?: string | null }> | null;
};

type SupportReport = {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  related_transaction_id: string | null;
  created_at: string;
};

export function SupportReportPanel({
  transactions,
  reports
}: {
  transactions: SupportTransaction[];
  reports: SupportReport[];
}) {
  const first = <T,>(value: T | T[] | null | undefined) => Array.isArray(value) ? value[0] ?? null : value ?? null;

  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Pusat Bantuan</h2>
      <form action={createSupportReportAction} className="mt-4 grid gap-3">
        <ReturnToInput />
        <input className="field" name="subject" placeholder="Subjek laporan" required />
        <textarea className="field min-h-24" name="message" placeholder="Ceritakan kendalanya" required />
        <select className="field" name="related_transaction_id" defaultValue="">
          <option value="">Tanpa transaksi terkait</option>
          {transactions.map((transaction) => (
            <option key={transaction.id} value={transaction.id}>
              {formatDateTime(transaction.created_at)} - {first(transaction.canteens)?.canteen_name ?? "Transaksi"} - {formatRupiah(Number(transaction.amount))} - {formatStatus(transaction.status)}
            </option>
          ))}
        </select>
        <SubmitButton className="btn-primary" pendingText="Mengirim laporan...">Lapor Admin</SubmitButton>
      </form>

      <div className="mt-5 divide-y divide-line">
        {reports.map((report) => (
          <div className="py-3 text-sm" key={report.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-black">{report.subject}</p>
              <span className="rounded-full border border-line px-2 py-1 text-xs font-semibold">{formatStatus(report.status)}</span>
            </div>
            <p className="mt-1 text-ink/70">{report.message}</p>
            {report.admin_reply ? <p className="mt-2 rounded-md bg-mint/20 p-2 text-ink/75">Balasan admin: {report.admin_reply}</p> : null}
            <p className="mt-2 text-xs text-ink/50">{formatDateTime(report.created_at)}</p>
          </div>
        ))}
        {reports.length === 0 ? <p className="py-5 text-sm text-ink/60">Belum ada laporan.</p> : null}
      </div>
    </section>
  );
}
