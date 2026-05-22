import { createProductAction, deactivateProductAction, updateProductAction } from "@/app/actions/canteen";
import { AiComingSoon } from "@/components/AiComingSoon";
import { AppShell } from "@/components/AppShell";
import { CanteenPos } from "@/components/CanteenPos";
import { EmptyState } from "@/components/EmptyState";
import { PageNotice } from "@/components/PageNotice";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/SubmitButton";
import { SupportReportPanel } from "@/components/SupportReportPanel";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";

async function getCanteenData(user_id: string) {
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
    return { canteen: null, products: [], transactions: [], revenue_today: 0, support_reports: support_reports ?? [] };
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
    .select("id,child_id,canteen_id,card_id,amount,status,failure_reason,created_at,canteens(canteen_name)")
    .eq("canteen_id", canteen.id)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  const revenue_today = (transactions ?? [])
    .filter((transaction) => transaction.status === "success")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const { data: support_reports } = await admin
    .from("support_reports")
    .select("id,subject,message,status,admin_reply,related_transaction_id,created_at")
    .eq("reporter_user_id", user_id)
    .order("created_at", { ascending: false });

  return { canteen, products: products ?? [], transactions: transactions ?? [], revenue_today, support_reports: support_reports ?? [] };
}

type CanteenData = Awaited<ReturnType<typeof getCanteenData>>;
type ActiveCanteen = NonNullable<CanteenData["canteen"]>;

export default async function CanteenDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string; view?: string }>;
}) {
  const user = await requireUser(["CANTEEN"]);
  const params = await searchParams;
  const data = await getCanteenData(user.id);
  const view = params.view ?? "pos";
  const links = [
    { href: "/dashboard/canteen", label: "POS Kantin" },
    { href: "/dashboard/canteen?view=products", label: "Produk/Menu" },
    { href: "/dashboard/canteen?view=transactions", label: "Transaksi Hari Ini" },
    { href: "/dashboard/canteen?view=recap", label: "Rekap Pendapatan" },
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
            <div className="mt-4"><CanteenPos products={data.products} /></div>
          </div>
        </section>
      ) : view === "products" ? (
        <ProductsSection products={data.products} />
      ) : view === "transactions" ? (
        <TransactionsSection transactions={data.transactions} />
      ) : view === "recap" ? (
        <RecapSection transactions={data.transactions} revenue={data.revenue_today} />
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
        <input className="field" name="name" placeholder="Nama produk" required />
        <input className="field" name="price" type="number" min={0} placeholder="Harga" required />
        <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Tambah</SubmitButton>
      </form>
      <div className="mt-4 grid gap-3">
        {products.map((product) => (
          <form action={updateProductAction} className="grid gap-2 rounded-3xl border border-line bg-white p-4 md:grid-cols-5" key={product.id}>
            <input type="hidden" name="product_id" value={product.id} />
            <input className="field" name="name" defaultValue={product.name} />
            <input className="field" name="price" type="number" min={0} defaultValue={product.price} />
            <label className="flex items-center gap-2 text-sm font-bold"><input name="is_active" type="checkbox" defaultChecked={product.is_active} /> <StatusBadge status={product.is_active ? "active" : "inactive"} /></label>
            <button className="btn-secondary">Edit</button>
            <button className="btn-secondary" formAction={deactivateProductAction}>Nonaktifkan</button>
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

function RecapSection({ transactions, revenue }: { transactions: CanteenData["transactions"]; revenue: number }) {
  const success = transactions.filter((transaction) => transaction.status === "success").length;
  const failed = transactions.filter((transaction) => transaction.status === "failed").length;
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Pendapatan hari ini</p><p className="mt-2 text-3xl font-black">{formatRupiah(revenue)}</p></div>
      <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Transaksi berhasil</p><p className="mt-2 text-3xl font-black">{success}</p></div>
      <div className="panel rounded-lg p-5"><p className="text-sm text-ink/55">Transaksi gagal</p><p className="mt-2 text-3xl font-black">{failed}</p></div>
    </section>
  );
}
