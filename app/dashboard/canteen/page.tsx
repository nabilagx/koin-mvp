import { createProductAction, deactivateProductAction, updateProductAction } from "@/app/actions/canteen";
import { CanteenPos } from "@/components/CanteenPos";
import { AppShell } from "@/components/AppShell";
import { DashboardNav } from "@/components/DashboardNav";
import { PageNotice } from "@/components/PageNotice";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/SubmitButton";
import { SupportReportPanel } from "@/components/SupportReportPanel";
import { requireUser } from "@/lib/auth";
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

export default async function CanteenDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireUser(["CANTEEN"]);
  const params = await searchParams;
  const data = await getCanteenData(user.id);

  return (
    <AppShell user={user} title="Canteen Dashboard">
      <DashboardNav links={[{ href: "/dashboard/canteen", label: "POS Kantin" }]} />
      <PageNotice error={params.error} success={params.success} />
      {!data.canteen ? (
        <div className="grid gap-6">
          <div className="panel rounded-lg p-6 text-sm text-ink/65">Profil kantin belum tersedia.</div>
          <SupportReportPanel transactions={[]} reports={data.support_reports} />
        </div>
      ) : data.canteen.status === "pending" ? (
        <div className="grid gap-6">
          <div className="panel rounded-lg p-6 text-sm text-ink/65">Akun kantin Anda sedang menunggu verifikasi admin.</div>
          <SupportReportPanel transactions={[]} reports={data.support_reports} />
        </div>
      ) : data.canteen.status === "suspended" ? (
        <div className="grid gap-6">
          <div className="panel rounded-lg p-6 text-sm text-ink/65">Akun kantin Anda sedang dibekukan.</div>
          <SupportReportPanel transactions={[]} reports={data.support_reports} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="panel rounded-lg p-5">
            <h2 className="text-lg font-black">{data.canteen.canteen_name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink/60"><span>{data.canteen.owner_name} - {data.canteen.school_name ?? "school_name belum diisi"}</span><StatusBadge status={data.canteen.status} /></div>
            <div className="mt-4 rounded-md border border-line p-3">
              <p className="text-sm text-ink/60">Pendapatan simulasi hari ini</p>
              <p className="text-2xl font-black">{formatRupiah(data.revenue_today)}</p>
            </div>

            <h3 className="mt-6 font-black">POS transaksi</h3>
            <div className="mt-3"><CanteenPos products={data.products} /></div>

            <h3 className="mt-6 font-black">Produk sederhana</h3>
            <form action={createProductAction} className="mt-3 flex gap-2">
              <input className="field" name="name" placeholder="Nama produk" required />
              <input className="field" name="price" type="number" min={0} placeholder="Harga" required />
              <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Tambah</SubmitButton>
            </form>
            <div className="mt-4 grid gap-3">
              {data.products.map((product) => (
                <form action={updateProductAction} className="grid gap-2 rounded-3xl border border-line bg-white p-4 md:grid-cols-5" key={product.id}>
                  <input type="hidden" name="product_id" value={product.id} />
                  <input className="field" name="name" defaultValue={product.name} />
                  <input className="field" name="price" type="number" min={0} defaultValue={product.price} />
                  <label className="flex items-center gap-2 text-sm font-bold"><input name="is_active" type="checkbox" defaultChecked={product.is_active} /> <StatusBadge status={product.is_active ? "active" : "inactive"} /></label>
                  <button className="btn-secondary">Edit</button>
                  <button className="btn-secondary" formAction={deactivateProductAction}>Nonaktifkan</button>
                </form>
              ))}
            </div>
          </section>

          <section className="grid gap-6">
          <section className="panel rounded-lg p-5">
            <h2 className="text-lg font-black">Transaksi Hari Ini</h2>
            <div className="mt-4 divide-y divide-line">
              {data.transactions.map((transaction) => (
                <div className="flex items-center justify-between gap-4 py-3" key={transaction.id}>
                  <div><StatusBadge status={transaction.status} /><p className="mt-1 text-sm text-ink/60">{transaction.failure_reason ?? "Transaksi berhasil"}</p></div>
                  <p className="font-black">{formatRupiah(Number(transaction.amount))}</p>
                </div>
              ))}
              {data.transactions.length === 0 ? <p className="py-6 text-sm text-ink/65">Belum ada transaksi hari ini.</p> : null}
            </div>
          </section>
          <SupportReportPanel transactions={data.transactions} reports={data.support_reports} />
          </section>
        </div>
      )}
    </AppShell>
  );
}
