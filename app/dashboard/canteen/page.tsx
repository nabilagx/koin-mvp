import { createProductAction, deactivateProductAction, updateProductAction } from "@/app/actions/canteen";
import { AiComingSoon } from "@/components/AiComingSoon";
import { AppShell } from "@/components/AppShell";
import { CanteenPos } from "@/components/CanteenPos";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { CsvExportButton } from "@/components/CsvExportButton";
import { EmptyState } from "@/components/EmptyState";
import { PageNotice } from "@/components/PageNotice";
import { ReturnToInput } from "@/components/ReturnToInput";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/SubmitButton";
import { SupportReportPanel } from "@/components/SupportReportPanel";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { formatStatus } from "@/lib/labels";
import { createAdminClient } from "@/lib/supabase/admin";

type CanteenFilters = {
  range?: string;
  from?: string;
  to?: string;
};

function getRangeStart(range?: string) {
  const date = new Date();
  if (range === "today") {
    date.setHours(0, 0, 0, 0);
    return date;
  }
  if (range === "7d") {
    date.setDate(date.getDate() - 7);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  if (range === "30d") {
    date.setDate(date.getDate() - 30);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  return null;
}

async function getCanteenData(user_id: string, filters: CanteenFilters = {}) {
  const admin = createAdminClient();
  const { data: canteen } = await admin
    .from("canteens")
    .select("id,canteen_name,owner_name,school_name,phone,has_nfc_device,status,created_at")
    .eq("user_id", user_id)
    .single();

  if (!canteen) {
    const { data: support_reports } = await admin
      .from("support_reports")
      .select("id,subject,message,status,admin_reply,related_transaction_id,created_at")
      .eq("reporter_user_id", user_id)
      .order("created_at", { ascending: false });
    return { canteen: null, products: [], transactions: [], recap_transactions: [], revenue_today: 0, support_reports: support_reports ?? [], demo_cards: [] };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: products } = await admin
    .from("products")
    .select("id,canteen_id,name,price,is_active,created_at")
    .eq("canteen_id", canteen.id)
    .order("created_at", { ascending: false });

  const { data: transactions } = await admin
    .from("transactions")
    .select("id,child_id,canteen_id,card_id,amount,status,failure_reason,created_at,canteens(canteen_name),children(name,grade),transaction_items(qty,price,subtotal,products(name))")
    .eq("canteen_id", canteen.id)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  let recapQuery = admin
    .from("transactions")
    .select("id,child_id,canteen_id,card_id,amount,status,failure_reason,created_at,children(name,grade),transaction_items(qty,price,subtotal,products(name))")
    .eq("canteen_id", canteen.id)
    .order("created_at", { ascending: false })
    .limit(500);

  const rangeStart = getRangeStart(filters.range);
  if (rangeStart) recapQuery = recapQuery.gte("created_at", rangeStart.toISOString());
  if (filters.from) recapQuery = recapQuery.gte("created_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) recapQuery = recapQuery.lte("created_at", `${filters.to}T23:59:59.999Z`);
  const { data: recap_transactions } = await recapQuery;

  const revenue_today = (transactions ?? [])
    .filter((transaction) => transaction.status === "success")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const { data: support_reports } = await admin
    .from("support_reports")
    .select("id,subject,message,status,admin_reply,related_transaction_id,created_at")
    .eq("reporter_user_id", user_id)
    .order("created_at", { ascending: false });

  const { data: demo_cards } = await admin
    .from("cards")
    .select("id,child_id,card_uid,card_label,status,children(name,grade,school_name)")
    .order("created_at", { ascending: false })
    .limit(80);

  return { canteen, products: products ?? [], transactions: transactions ?? [], recap_transactions: recap_transactions ?? [], revenue_today, support_reports: support_reports ?? [], demo_cards: demo_cards ?? [] };
}

type CanteenData = Awaited<ReturnType<typeof getCanteenData>>;
type ActiveCanteen = NonNullable<CanteenData["canteen"]>;

export default async function CanteenDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string; view?: string; range?: string; from?: string; to?: string }>;
}) {
  const user = await requireUser(["CANTEEN"]);
  const params = await searchParams;
  const data = await getCanteenData(user.id, { range: params.range, from: params.from, to: params.to });
  const view = params.view ?? "pos";
  const links = [
    { href: "/dashboard/canteen", label: "POS Kantin" },
    { href: "/dashboard/canteen?view=products", label: "Produk/Menu" },
    { href: "/dashboard/canteen?view=transactions", label: "Transaksi Hari Ini" },
    { href: "/dashboard/canteen?view=recap", label: "Rekap Penjualan" },
    { href: "/dashboard/canteen?view=support", label: "Lapor Admin" },
    { href: "/dashboard/canteen?view=ai", label: "AI Insight Segera Hadir" },
    { href: "/dashboard/canteen?view=settings", label: "Pengaturan" }
  ];

  return (
    <AppShell user={user} title="Dashboard Kantin" navLinks={links} navTitle="Menu Kantin">
      <PageNotice error={params.error} success={params.success} />
      {!data.canteen ? (
        <StatusPanel message="Profil kantin belum tersedia." reports={data.support_reports} />
      ) : data.canteen.status === "pending" ? (
        <StatusPanel message="Akun kantin Anda sedang menunggu verifikasi admin." reports={data.support_reports} />
      ) : data.canteen.status === "suspended" ? (
        <StatusPanel message="Akun kantin Anda sedang dibekukan." reports={data.support_reports} />
      ) : view === "pos" ? (
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <CanteenSummary canteen={data.canteen} revenue={data.revenue_today} />
          <div className="panel rounded-lg p-5">
            <h2 className="text-lg font-black">POS transaksi</h2>
            <div className="mt-4"><CanteenPos products={data.products} demoCards={data.demo_cards} /></div>
          </div>
        </section>
      ) : view === "products" ? (
        <ProductsSection products={data.products} />
      ) : view === "transactions" ? (
        <TransactionsSection transactions={data.transactions} />
      ) : view === "recap" ? (
        <RecapSection transactions={data.transactions} recapTransactions={data.recap_transactions} revenue={data.revenue_today} filters={{ range: params.range ?? "all", from: params.from ?? "", to: params.to ?? "" }} />
      ) : view === "support" ? (
        <SupportReportPanel transactions={data.transactions} reports={data.support_reports} />
      ) : view === "ai" ? (
        <AiComingSoon
          title="AI Insight Kantin"
          description="Fitur ini akan membantu kantin melihat tren menu populer dan rekap penjualan sederhana."
          items={["Menu paling laris", "Jam transaksi ramai", "Rekomendasi stok sederhana", "Ringkasan penjualan"]}
        />
      ) : (
        <section className="panel rounded-lg p-6">
          <h2 className="text-2xl font-black">Pengaturan</h2>
        <p className="mt-3 text-sm text-ink/65">{data.canteen.canteen_name} - {data.canteen.owner_name} - {data.canteen.school_name ?? "Sekolah belum diisi"}</p>
        </section>
      )}
    </AppShell>
  );
}

function StatusPanel({ message, reports }: { message: string; reports: CanteenData["support_reports"] }) {
  return (
    <div className="grid gap-6">
      <div className="panel rounded-lg p-6 text-sm text-ink/65">{message}</div>
      <SupportReportPanel transactions={[]} reports={reports} />
    </div>
  );
}

function CanteenSummary({ canteen, revenue }: { canteen: ActiveCanteen; revenue: number }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">{canteen.canteen_name}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink/60">
        <span>{canteen.owner_name} - {canteen.school_name ?? "Sekolah belum diisi"}</span>
        <StatusBadge status={canteen.status} />
      </div>
      <div className="mt-5 rounded-3xl border border-line bg-gold/25 p-4">
        <p className="text-sm text-ink/60">Pendapatan simulasi hari ini</p>
        <p className="text-3xl font-black">{formatRupiah(revenue)}</p>
      </div>
    </section>
  );
}

function ProductsSection({ products }: { products: CanteenData["products"] }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Produk/Menu</h2>
      <form action={createProductAction} className="mt-4 grid gap-2 sm:grid-cols-[1fr_180px_auto]">
        <ReturnToInput />
        <input className="field" name="name" placeholder="Nama produk" required />
        <input className="field" name="price" type="number" min={0} placeholder="Harga" required />
        <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Tambah</SubmitButton>
      </form>
      <div className="mt-4 grid gap-3">
        {products.map((product) => (
          <form action={updateProductAction} className="grid gap-2 rounded-3xl border border-line bg-white p-4 md:grid-cols-5" key={product.id}>
            <ReturnToInput />
            <input type="hidden" name="product_id" value={product.id} />
            <input className="field" name="name" defaultValue={product.name} />
            <input className="field" name="price" type="number" min={0} defaultValue={product.price} />
            <label className="flex items-center gap-2 text-sm font-bold"><input name="is_active" type="checkbox" defaultChecked={product.is_active} /> <StatusBadge status={product.is_active ? "active" : "inactive"} /></label>
            <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Edit</SubmitButton>
            <ConfirmSubmitButton className="btn-secondary" formAction={deactivateProductAction} message="Yakin ingin menonaktifkan produk ini?" pendingText="Menonaktifkan...">Nonaktifkan</ConfirmSubmitButton>
          </form>
        ))}
        {products.length === 0 ? <EmptyState title="Belum ada produk" description="Tambahkan menu sederhana untuk POS kantin." /> : null}
      </div>
    </section>
  );
}

function TransactionsSection({ transactions }: { transactions: CanteenData["transactions"] }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Transaksi Hari Ini</h2>
      <div className="mt-4 divide-y divide-line">
        {transactions.map((transaction) => (
          <div className="flex items-center justify-between gap-4 py-3" key={transaction.id}>
            <div><StatusBadge status={transaction.status} /><p className="mt-1 text-sm text-ink/60">{transaction.failure_reason ?? "Transaksi berhasil"} - {formatDateTime(transaction.created_at)}</p></div>
            <p className="font-black">{formatRupiah(Number(transaction.amount))}</p>
          </div>
        ))}
        {transactions.length === 0 ? <EmptyState title="Belum ada transaksi" description="Transaksi hari ini akan muncul di sini." /> : null}
      </div>
    </section>
  );
}

type RecapTransaction = CanteenData["recap_transactions"][number];

function first<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function transactionItems(transaction: RecapTransaction) {
  const items = "transaction_items" in transaction ? transaction.transaction_items : null;
  return Array.isArray(items) ? items : [];
}

function itemLabel(transaction: RecapTransaction) {
  const items = transactionItems(transaction);
  if (items.length === 0) return "Transaksi nominal manual";
  return items.map((item) => `${first(item.products)?.name ?? "Produk"} x${item.qty}`).join(", ");
}

function RecapSection({
  transactions,
  recapTransactions,
  revenue,
  filters
}: {
  transactions: CanteenData["transactions"];
  recapTransactions: CanteenData["recap_transactions"];
  revenue: number;
  filters: { range: string; from: string; to: string };
}) {
  const todaySuccess = transactions.filter((transaction) => transaction.status === "success");
  const todayFailed = transactions.filter((transaction) => transaction.status === "failed");
  const todaySoldQty = todaySuccess.reduce((total, transaction) => total + transactionItems(transaction as RecapTransaction).reduce((sum, item) => sum + Number(item.qty ?? 0), 0), 0);

  const successTransactions = recapTransactions.filter((transaction) => transaction.status === "success");
  const failedTransactions = recapTransactions.filter((transaction) => transaction.status === "failed");
  const totalRevenue = successTransactions.reduce((total, transaction) => total + Number(transaction.amount), 0);
  const totalSoldQty = successTransactions.reduce((total, transaction) => total + transactionItems(transaction).reduce((sum, item) => sum + Number(item.qty ?? 0), 0), 0);
  const averageTransaction = successTransactions.length ? Math.round(totalRevenue / successTransactions.length) : 0;
  const productStats = new Map<string, number>();
  successTransactions.forEach((transaction) => {
    transactionItems(transaction).forEach((item) => {
      const name = first(item.products)?.name ?? "Produk";
      productStats.set(name, (productStats.get(name) ?? 0) + Number(item.qty ?? 0));
    });
  });
  const bestSeller = Array.from(productStats.entries()).sort((a, b) => b[1] - a[1])[0];

  return (
    <section className="grid gap-5">
      <div className="panel rounded-lg p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Rekap Penjualan</h2>
            <p className="mt-1 text-sm text-ink/60">Rekap ini merupakan simulasi MVP. Pencairan otomatis ke rekening kantin masuk fase lanjutan.</p>
          </div>
          <form className="grid gap-2 sm:grid-cols-[160px_160px_160px_auto]">
            <input type="hidden" name="view" value="recap" />
            <select className="field" name="range" defaultValue={filters.range}>
              <option value="all">Semua waktu</option>
              <option value="today">Hari ini</option>
              <option value="7d">7 hari terakhir</option>
              <option value="30d">30 hari terakhir</option>
            </select>
            <input className="field" name="from" type="date" defaultValue={filters.from} />
            <input className="field" name="to" type="date" defaultValue={filters.to} />
            <button className="btn-secondary">Filter</button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Pendapatan Hari Ini</p><p className="mt-2 text-3xl font-black">{formatRupiah(revenue)}</p></div>
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Transaksi Berhasil Hari Ini</p><p className="mt-2 text-3xl font-black">{todaySuccess.length}</p></div>
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Transaksi Gagal Hari Ini</p><p className="mt-2 text-3xl font-black">{todayFailed.length}</p></div>
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Produk Terjual Hari Ini</p><p className="mt-2 text-3xl font-black">{todaySoldQty}</p></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Total Pendapatan Simulasi</p><p className="mt-2 text-3xl font-black">{formatRupiah(totalRevenue)}</p></div>
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Total Transaksi Berhasil</p><p className="mt-2 text-3xl font-black">{successTransactions.length}</p></div>
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Total Transaksi Gagal</p><p className="mt-2 text-3xl font-black">{failedTransactions.length}</p></div>
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Total Produk Terjual</p><p className="mt-2 text-3xl font-black">{totalSoldQty}</p></div>
        <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Rata-rata Transaksi</p><p className="mt-2 text-3xl font-black">{formatRupiah(averageTransaction)}</p></div>
      </div>

      <div className="panel rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black">Detail Transaksi</h3>
            <p className="mt-1 text-sm text-ink/60">Produk/Menu terlaris: <strong>{bestSeller ? `${bestSeller[0]} (${bestSeller[1]} terjual)` : "Belum ada data"}</strong></p>
          </div>
          <CsvExportButton
            filename="rekap-penjualan-kantin.csv"
            rows={recapTransactions.map((transaction) => {
              const child = first(transaction.children);
              return {
                created_at: formatDateTime(transaction.created_at),
                child_name: child?.name ?? "-",
                grade: child?.grade ?? "-",
                items: itemLabel(transaction),
                amount: Number(transaction.amount),
                status: formatStatus(transaction.status),
                failure_reason: transaction.failure_reason ?? ""
              };
            })}
          />
        </div>
        <div className="mt-4 divide-y divide-line">
          {recapTransactions.map((transaction) => {
            const child = first(transaction.children);
            return (
              <div className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_1fr_auto]" key={transaction.id}>
                <div>
                  <p className="font-black">{child?.name ?? "Anak"} {child?.grade ? `- ${child.grade}` : ""}</p>
                  <p className="mt-1 text-ink/55">{formatDateTime(transaction.created_at)}</p>
                </div>
                <div>
                  <p className="font-semibold">{itemLabel(transaction)}</p>
                  {transaction.failure_reason ? <p className="mt-1 text-red-600">Alasan Gagal: {transaction.failure_reason}</p> : null}
                </div>
                <div className="text-left md:text-right">
                  <StatusBadge status={transaction.status} />
                  <p className="mt-2 font-black">{formatRupiah(Number(transaction.amount))}</p>
                </div>
              </div>
            );
          })}
          {recapTransactions.length === 0 ? <EmptyState title="Belum ada transaksi" description="Transaksi sesuai filter akan tampil di sini." /> : null}
        </div>
      </div>
    </section>
  );
}
