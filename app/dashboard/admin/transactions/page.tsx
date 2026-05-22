import { AppShell } from "@/components/AppShell";
import { CsvExportButton } from "@/components/CsvExportButton";
import { PageNotice } from "@/components/PageNotice";
import { StatusBadge } from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { formatStatus } from "@/lib/labels";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminTransaction = {
  id: string;
  child_id: string | null;
  canteen_id: string | null;
  card_id: string | null;
  amount: number | string;
  status: string;
  failure_reason: string | null;
  created_at: string;
  children?: { name?: string | null; parent_id?: string | null } | Array<{ name?: string | null; parent_id?: string | null }> | null;
  canteens?: { canteen_name?: string | null } | Array<{ canteen_name?: string | null }> | null;
  cards?: { card_uid?: string | null; card_label?: string | null } | Array<{ card_uid?: string | null; card_label?: string | null }> | null;
};

type TransactionItemRow = {
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

export default async function AdminTransactionsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string; status?: string; search?: string; from?: string; to?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  const admin = createAdminClient();
  let query = admin
    .from("transactions")
    .select("id,child_id,canteen_id,card_id,amount,status,failure_reason,created_at,children(name,parent_id),canteens(canteen_name),cards(card_uid,card_label)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.status) query = query.eq("status", params.status);
  if (params.from) query = query.gte("created_at", `${params.from}T00:00:00.000Z`);
  if (params.to) query = query.lte("created_at", `${params.to}T23:59:59.999Z`);
  const { data } = await query;
  const transaction_ids = ((data ?? []) as AdminTransaction[]).map((item) => item.id);
  const parent_ids = Array.from(new Set(((data ?? []) as AdminTransaction[]).map((item) => first(item.children)?.parent_id).filter(Boolean))) as string[];

  const [{ data: parents }, { data: transactionItems }] = await Promise.all([
    parent_ids.length ? admin.from("parents").select("id,users:user_id(name,email)").in("id", parent_ids) : Promise.resolve({ data: [] }),
    transaction_ids.length ? admin.from("transaction_items").select("id,transaction_id,qty,price,subtotal,products(name)").in("transaction_id", transaction_ids) : Promise.resolve({ data: [] })
  ]);

  const parentById = new Map((parents ?? []).map((parent) => {
    const userRow = Array.isArray(parent.users) ? parent.users[0] : parent.users;
    return [parent.id, { name: userRow?.name ?? "-", email: userRow?.email ?? "-" }];
  }));
  const itemsByTransactionId = new Map<string, TransactionItemRow[]>();
  ((transactionItems ?? []) as TransactionItemRow[]).forEach((item) => {
    const current = itemsByTransactionId.get(item.transaction_id) ?? [];
    current.push(item);
    itemsByTransactionId.set(item.transaction_id, current);
  });

  const search = (params.search ?? "").toLowerCase();
  const transactions = ((data ?? []) as AdminTransaction[]).filter((item) => {
    if (!search) return true;
    const child = first(item.children);
    const canteen = first(item.canteens);
    const card = first(item.cards);
    const parent = child?.parent_id ? parentById.get(child.parent_id) : null;
    return [child?.name, parent?.name, parent?.email, canteen?.canteen_name, card?.card_uid, card?.card_label, item.status, item.failure_reason]
      .some((value) => String(value ?? "").toLowerCase().includes(search));
  });

  return (
    <AppShell user={user} title="Data Transaksi">
      <PageNotice error={params.error} success={params.success} />
      <form className="mb-4 grid gap-2 md:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_auto_auto]">
        <input className="field" name="search" placeholder="Cari anak, orang tua, kantin, UID Kartu" defaultValue={params.search ?? ""} />
        <select className="field" name="status" defaultValue={params.status ?? ""}>
          <option value="">Semua Status</option>
          <option value="success">{formatStatus("success")}</option>
          <option value="failed">{formatStatus("failed")}</option>
          <option value="refunded">{formatStatus("refunded")}</option>
        </select>
        <input className="field" name="from" type="date" defaultValue={params.from ?? ""} />
        <input className="field" name="to" type="date" defaultValue={params.to ?? ""} />
        <button className="btn-secondary">Filter</button>
        <CsvExportButton
          filename="transactions.csv"
          rows={transactions.map((item) => {
            const child = first(item.children);
            const canteen = first(item.canteens);
            const card = first(item.cards);
            const parent = child?.parent_id ? parentById.get(child.parent_id) : null;
            const items = itemsByTransactionId.get(item.id) ?? [];
            return {
              waktu: formatDateTime(item.created_at),
              anak: child?.name,
              orang_tua: parent?.name,
              email_orang_tua: parent?.email,
              kantin: canteen?.canteen_name,
              uid_kartu: card?.card_uid,
              items: items.length ? items.map((detail) => `${first(detail.products)?.name ?? "Produk"} x${detail.qty}`).join("; ") : "Transaksi nominal manual",
              nominal: item.amount,
              status: formatStatus(item.status),
              alasan_gagal: item.failure_reason
            };
          })}
        />
      </form>
      <div className="grid gap-3">
        {transactions.map((item) => {
          const child = first(item.children);
          const canteen = first(item.canteens);
          const card = first(item.cards);
          const parent = child?.parent_id ? parentById.get(child.parent_id) : null;
          const items = itemsByTransactionId.get(item.id) ?? [];
          return (
            <div className="panel rounded-lg p-5 text-sm" key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-black">{formatRupiah(Number(item.amount))}</p>
                <StatusBadge status={item.status} />
              </div>
              <div className="mt-2 grid gap-1 text-ink/75 md:grid-cols-2">
                <p>Anak: <strong>{child?.name ?? "-"}</strong></p>
                <p>Orang Tua: <strong>{parent?.name ?? "-"}</strong> ({parent?.email ?? "-"})</p>
                <p>Kantin: <strong>{canteen?.canteen_name ?? "-"}</strong></p>
                <p>UID Kartu: <strong>{card?.card_uid ?? "-"}</strong> {card?.card_label ? `(${card.card_label})` : ""}</p>
                <p>Status: <StatusBadge status={item.status} /></p>
                <p>Alasan Gagal: <strong>{item.failure_reason ?? "-"}</strong></p>
              </div>
              <div className="mt-3 rounded-md border border-line p-3">
                <p className="font-semibold">Detail Produk</p>
                {items.length ? (
                  <div className="mt-2 divide-y divide-line">
                    {items.map((detail) => (
                      <div className="grid gap-2 py-2 sm:grid-cols-4" key={detail.id}>
                        <span>{first(detail.products)?.name ?? "Produk"}</span>
                        <span>Jumlah {detail.qty}</span>
                        <span>{formatRupiah(Number(detail.price))}</span>
                        <strong>{formatRupiah(Number(detail.subtotal))}</strong>
                      </div>
                    ))}
                  </div>
                ) : <p className="mt-2 text-ink/60">Transaksi nominal manual.</p>}
              </div>
              <p className="mt-2 text-xs text-ink/55">{formatDateTime(item.created_at)} - ID Transaksi: {item.id}</p>
              <p className="mt-2 text-xs text-ink/55">Jika transaksi bermasalah, arahkan user membuat laporan di Pusat Bantuan. Riwayat transaksi tidak dihapus.</p>
            </div>
          );
        })}
        {transactions.length === 0 ? <p className="panel rounded-lg p-6 text-sm text-ink/60">Tidak ada transaksi sesuai filter.</p> : null}
      </div>
    </AppShell>
  );
}
