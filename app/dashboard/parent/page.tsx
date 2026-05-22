import { AppShell } from "@/components/AppShell";
import { AiComingSoon } from "@/components/AiComingSoon";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { EmptyState } from "@/components/EmptyState";
import { PageNotice } from "@/components/PageNotice";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/SubmitButton";
import { SupportReportPanel } from "@/components/SupportReportPanel";
import {
  approveMissionAction,
  createChildAction,
  createMidtransTopupAction,
  createMissionAction,
  createSavingsPocketAction,
  requestCardAction,
  setDailyLimitAction,
  simulateTopupSettlementAction,
  topUpChildAction,
  updateChildProfileAction,
  updateChildPinAction,
  updateCardStatusAction,
  updateSavingRequestStatusAction
} from "@/app/actions/parent";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { getDailyLimitUsage } from "@/lib/limits";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ChildSummary } from "@/lib/types";

type ParentChildRow = {
  id: string;
  parent_id: string;
  user_id: string;
  name: string;
  school_name: string | null;
  grade: string | null;
  daily_limit: number | string;
  users?: { email?: string | null } | Array<{ email?: string | null }> | null;
  wallets?: Array<{ balance?: number | string | null }> | null;
  cards?: Array<{ id?: string | null; card_uid?: string | null; card_label?: string | null; status?: string | null }> | null;
};

async function getParentData(user_id: string, requested_child_id?: string) {
  const admin = createAdminClient();
  const { data: parent } = await admin.from("parents").select("id,user_id,phone,address_optional,created_at").eq("user_id", user_id).single();
  if (!parent) return null;

  const { data: children } = await admin
    .from("children")
    .select("id,parent_id,user_id,name,school_name,grade,daily_limit,users:user_id(email),wallets(balance),cards(id,card_uid,card_label,status)")
    .eq("parent_id", parent.id)
    .order("created_at", { ascending: true });

  const mapped = ((children ?? []) as ParentChildRow[]).map((child) => {
    const userRow = Array.isArray(child.users) ? child.users[0] : child.users;
    return {
      id: child.id,
      parent_id: child.parent_id,
      user_id: child.user_id,
      name: child.name,
      email: userRow?.email ?? "-",
      school_name: child.school_name,
      grade: child.grade,
      daily_limit: Number(child.daily_limit ?? 0),
      card_id: child.cards?.[0]?.id ?? null,
      card_uid: child.cards?.[0]?.card_uid ?? null,
      card_label: child.cards?.[0]?.card_label ?? null,
      card_status: child.cards?.[0]?.status ?? null,
      balance: Number(child.wallets?.[0]?.balance ?? 0)
    };
  }) as ChildSummary[];

  const selected_child = mapped.find((child) => child.id === requested_child_id) ?? mapped[0] ?? null;
  const selected_child_id = selected_child?.id;

  const { data: transactions } = selected_child_id
    ? await admin.from("transactions").select("id,child_id,canteen_id,card_id,amount,status,failure_reason,created_at,canteens(canteen_name)").eq("child_id", selected_child_id).order("created_at", { ascending: false }).limit(50)
    : { data: [] };
  const { data: pockets } = selected_child_id
    ? await admin.from("savings_pockets").select("id,child_id,name,target_amount,current_amount,status,created_at").eq("child_id", selected_child_id).order("created_at", { ascending: false })
    : { data: [] };
  const { data: requests } = selected_child_id
    ? await admin.from("saving_requests").select("id,saving_pocket_id,child_id,parent_id,amount,reason,status,payout_destination_type,created_at").eq("child_id", selected_child_id).order("created_at", { ascending: false })
    : { data: [] };
  const { data: missions } = selected_child_id
    ? await admin.from("missions").select("id,child_id,parent_id,title,description,reward_amount,status,evidence_text,evidence_url,submitted_at,approved_at,created_at").eq("child_id", selected_child_id).order("created_at", { ascending: false })
    : { data: [] };
  const { data: support_reports } = await admin
    .from("support_reports")
    .select("id,subject,message,status,admin_reply,related_transaction_id,created_at")
    .eq("reporter_user_id", user_id)
    .order("created_at", { ascending: false });
  const { data: topups } = selected_child_id
    ? await admin
      .from("topup_transactions")
      .select("id,parent_id,child_id,order_id,amount,status,midtrans_redirect_url,created_at,updated_at")
      .eq("parent_id", parent.id)
      .eq("child_id", selected_child_id)
      .order("created_at", { ascending: false })
      .limit(30)
    : { data: [] };

  const usage = selected_child_id
    ? await getDailyLimitUsage(admin, selected_child_id, selected_child?.daily_limit ?? 0)
    : { daily_limit: 0, spent_today: 0, saved_today: 0, remaining_today: 0 };

  return {
    children: mapped,
    selected_child,
    transactions: transactions ?? [],
    pockets: pockets ?? [],
    requests: requests ?? [],
    missions: missions ?? [],
    support_reports: support_reports ?? [],
    topups: topups ?? [],
    usage
  };
}

type ParentData = NonNullable<Awaited<ReturnType<typeof getParentData>>>;

export default async function ParentDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ child_id?: string; error?: string; success?: string; view?: string }>;
}) {
  const user = await requireUser(["PARENT"]);
  const params = await searchParams;
  const data = await getParentData(user.id, params.child_id);
  const child = data?.selected_child ?? null;
  const usage = data?.usage ?? { daily_limit: 0, spent_today: 0, saved_today: 0, remaining_today: 0 };
  const view = params.view ?? "summary";
  const parentHref = (nextView?: string) => {
    const query = new URLSearchParams();
    if (child?.id) query.set("child_id", child.id);
    if (nextView && nextView !== "summary") query.set("view", nextView);
    const suffix = query.toString();
    return `/dashboard/parent${suffix ? `?${suffix}` : ""}`;
  };
  const links = [
    { href: parentHref(), label: "Ringkasan" },
    { href: parentHref("children"), label: "Anak Saya" },
    { href: parentHref("saldo"), label: "Saldo & Limit" },
    { href: parentHref("topup"), label: "Top Up" },
    { href: parentHref("cards"), label: "Kartu" },
    { href: parentHref("savings"), label: "Celengan" },
    { href: parentHref("requests"), label: "Saving Requests" },
    { href: parentHref("missions"), label: "Misi" },
    { href: parentHref("transactions"), label: "Riwayat Transaksi" },
    { href: parentHref("support"), label: "Lapor Admin" },
    { href: parentHref("ai"), label: "AI Insight Coming Soon" },
    { href: parentHref("settings"), label: "Pengaturan" }
  ];

  return (
    <AppShell user={user} title="Parent Dashboard" navLinks={links} navTitle="Menu Parent">
      <PageNotice error={params.error} success={params.success} />

      <section className="panel rounded-lg p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-black">Pilih Anak</h2>
            <p className="text-sm text-ink/60">Semua data di bawah hanya untuk anak yang sedang dipilih.</p>
          </div>
          {data?.children.length ? (
            <form className="flex gap-2">
              {view !== "summary" ? <input type="hidden" name="view" value={view} /> : null}
              <select className="field min-w-64" name="child_id" defaultValue={child?.id}>
                {data.children.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <button className="btn-secondary">Tampilkan</button>
            </form>
          ) : null}
        </div>
      </section>

      {!data?.children.length ? (
        <div className="mt-6 grid gap-6">
          <div className="panel rounded-lg p-6 text-sm text-ink/65">Belum ada anak terdaftar.</div>
          {(view === "children" || view === "summary") ? (
            <AddChildSection />
          ) : view === "support" ? (
            <SupportReportPanel transactions={[]} reports={data?.support_reports ?? []} />
          ) : null}
        </div>
      ) : null}

      {data?.children.length && child ? (
        <div className="mt-6">
          {view === "summary" ? (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="panel rounded-lg p-5">
              <h2 className="text-lg font-black">{child.name}</h2>
              <p className="text-sm text-ink/60">{child.email} - {child.school_name ?? "Sekolah belum diisi"} - {child.grade ?? "Kelas belum diisi"}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><p className="text-ink/55">Saldo</p><p className="font-black">{formatRupiah(child.balance)}</p></div>
                <div><p className="text-ink/55">Daily limit</p><p className="font-black">{formatRupiah(usage.daily_limit)}</p></div>
                <div><p className="text-ink/55">Jajan hari ini</p><p className="font-black">{formatRupiah(usage.spent_today)}</p></div>
                <div><p className="text-ink/55">Tabungan hari ini</p><p className="font-black">{formatRupiah(usage.saved_today)}</p></div>
                <div><p className="text-ink/55">Sisa limit</p><p className="font-black">{formatRupiah(usage.remaining_today)}</p></div>
                <div><p className="text-ink/55">Kartu</p><div className="mt-1"><StatusBadge status={child.card_status ?? "Belum ada"} /></div></div>
              </div>
            </article>
            <section className="grid gap-3">
              {[
                ["Top Up", "Isi saldo manual atau Midtrans Sandbox.", parentHref("topup")],
                ["Kartu", "Lihat status kartu dan ajukan kartu baru.", parentHref("cards")],
                ["Celengan", "Pantau target tabungan anak.", parentHref("savings")],
                ["Misi", "Buat reward sederhana untuk anak.", parentHref("missions")]
              ].map(([title, desc, href]) => (
                <a className="panel rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-glow" href={href} key={title}>
                  <p className="text-lg font-black">{title}</p>
                  <p className="mt-2 text-sm text-ink/60">{desc}</p>
                </a>
              ))}
            </section>
          </section>
          ) : view === "children" ? (
            <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <AddChildSection />
              <div className="panel rounded-lg p-5">
                <h2 className="text-lg font-black">Anak Saya</h2>
                <form action={updateChildProfileAction} className="mt-4 grid gap-3 rounded-3xl border border-line bg-white p-4">
                  <input type="hidden" name="child_id" value={child.id} />
                  <p className="text-sm font-black text-mint">Edit identitas anak terpilih</p>
                  <label className="block text-sm font-semibold">Nama anak<input className="field mt-1" name="name" defaultValue={child.name} required /></label>
                  <label className="block text-sm font-semibold">Sekolah<input className="field mt-1" name="school_name" defaultValue={child.school_name ?? ""} /></label>
                  <label className="block text-sm font-semibold">Kelas<input className="field mt-1" name="grade" defaultValue={child.grade ?? ""} /></label>
                  <SubmitButton className="btn-primary w-full" pendingText="Menyimpan...">Simpan Perubahan</SubmitButton>
                </form>
                <div className="mt-4 grid gap-3">
                  {data.children.map((item) => (
                    <a className="rounded-3xl border border-line bg-white p-4 shadow-sm" href={`/dashboard/parent?child_id=${item.id}&view=summary`} key={item.id}>
                      <p className="font-black">{item.name}</p>
                      <p className="mt-1 text-sm text-ink/60">{item.school_name ?? "-"} - {item.grade ?? "-"}</p>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ) : view === "saldo" ? (
            <SaldoLimitSection child={child} usage={usage} />
          ) : view === "topup" ? (
            <TopupSection child={child} topups={data.topups} />
          ) : view === "cards" ? (
            <CardSection child={child} />
          ) : view === "transactions" ? (
            <TransactionsSection transactions={data.transactions} />
          ) : view === "savings" ? (
            <SavingsSection childId={child.id} pockets={data.pockets} />
          ) : view === "requests" ? (
            <RequestsSection requests={data.requests} />
          ) : view === "missions" ? (
            <MissionsSection childId={child.id} missions={data.missions} />
          ) : view === "support" ? (
            <SupportReportPanel transactions={data.transactions} reports={data.support_reports} />
          ) : view === "ai" ? (
            <AiComingSoon
              title="AI Insight Orang Tua"
              description="Fitur ini akan membantu orang tua memahami pola jajan, kebiasaan menabung, dan rekomendasi pengaturan uang saku anak."
              items={["Pola jajan mingguan", "Rekomendasi limit", "Deteksi pengeluaran tidak biasa", "Insight kebiasaan menabung"]}
            />
          ) : (
            <section className="panel rounded-lg p-6">
              <h2 className="text-2xl font-black">Pengaturan</h2>
              <p className="mt-3 text-sm text-ink/65">Pengaturan parent akan ditambahkan bertahap. Untuk saat ini, data anak dan PIN dikelola dari menu yang tersedia.</p>
            </section>
          )}
        </div>
      ) : null}
    </AppShell>
  );
}

function AddChildSection() {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Tambah Anak</h2>
      <form action={createChildAction} className="mt-4 space-y-4">
        <label className="block text-sm font-semibold">Nama anak<input className="field mt-1" name="name" required /></label>
        <label className="block text-sm font-semibold">Email login anak<input className="field mt-1" name="email" type="email" required /></label>
        <label className="block text-sm font-semibold">Password anak<input className="field mt-1" name="password" type="password" minLength={6} required /></label>
        <label className="block text-sm font-semibold">Nama sekolah<input className="field mt-1" name="school_name" /></label>
        <label className="block text-sm font-semibold">Kelas<input className="field mt-1" name="grade" /></label>
        <label className="block text-sm font-semibold">PIN transaksi<input className="field mt-1" name="pin" type="password" minLength={4} required /></label>
        <label className="block text-sm font-semibold">Limit harian<input className="field mt-1" name="daily_limit" type="number" min={0} defaultValue={25000} /></label>
        <label className="block text-sm font-semibold">Saldo awal<input className="field mt-1" name="initial_balance" type="number" min={0} defaultValue={0} /></label>
        <SubmitButton className="btn-primary w-full" pendingText="Membuat anak...">Buat child</SubmitButton>
      </form>
    </section>
  );
}

function SaldoLimitSection({ child, usage }: { child: ChildSummary; usage: { daily_limit: number; spent_today: number; saved_today: number; remaining_today: number } }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Saldo & Limit</h2>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-lilac/60 p-4"><p className="text-ink/55">Saldo</p><p className="text-2xl font-black">{formatRupiah(child.balance)}</p></div>
        <div className="rounded-3xl bg-white p-4"><p className="text-ink/55">Daily limit</p><p className="text-2xl font-black">{formatRupiah(usage.daily_limit)}</p></div>
        <div className="rounded-3xl bg-white p-4"><p className="text-ink/55">Terpakai hari ini</p><p className="text-2xl font-black">{formatRupiah(usage.spent_today + usage.saved_today)}</p></div>
        <div className="rounded-3xl bg-gold/25 p-4"><p className="text-ink/55">Sisa limit</p><p className="text-2xl font-black">{formatRupiah(usage.remaining_today)}</p></div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <form action={setDailyLimitAction} className="flex gap-2">
          <input type="hidden" name="child_id" value={child.id} />
          <input className="field" name="daily_limit" type="number" min={0} placeholder="daily_limit" required />
          <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Set limit</SubmitButton>
        </form>
        <form action={updateChildPinAction} className="flex gap-2">
          <input type="hidden" name="child_id" value={child.id} />
          <input className="field" name="pin" type="password" minLength={4} placeholder="PIN baru" required />
          <SubmitButton className="btn-secondary" pendingText="Menyimpan PIN...">Update PIN</SubmitButton>
        </form>
      </div>
    </section>
  );
}

function TopupSection({ child, topups }: { child: ChildSummary; topups: ParentData["topups"] }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Top Up</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <form action={topUpChildAction} className="flex gap-2">
          <input type="hidden" name="child_id" value={child.id} />
          <input className="field" name="amount" type="number" min={1} placeholder="Top up manual" required />
          <SubmitButton className="btn-primary" pendingText="Top up...">Simulasi Manual</SubmitButton>
        </form>
        <form action={createMidtransTopupAction} className="flex gap-2">
          <input type="hidden" name="child_id" value={child.id} />
          <input className="field" name="amount" type="number" min={1} placeholder="Midtrans Sandbox" required />
          <SubmitButton className="btn-secondary" pendingText="Membuat pembayaran...">Bayar via Midtrans Sandbox</SubmitButton>
        </form>
      </div>
      <div className="mt-5 divide-y divide-line">
        {topups.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm" key={item.id}>
            <div>
              <p className="font-semibold">{String(item.order_id).startsWith("manual-") ? "Manual demo" : "Midtrans Sandbox"} - {formatRupiah(Number(item.amount))}</p>
              <p className="text-ink/60">{item.status} - {formatDateTime(item.created_at)}</p>
              {item.midtrans_redirect_url && item.status === "pending" ? <a className="text-mint underline" href={item.midtrans_redirect_url}>Buka pembayaran Midtrans</a> : null}
            </div>
            {item.status === "pending" ? (
              <form action={simulateTopupSettlementAction}>
                <input type="hidden" name="topup_id" value={item.id} />
                <SubmitButton className="btn-secondary" pendingText="Memproses...">Simulasikan pembayaran sukses</SubmitButton>
              </form>
            ) : null}
          </div>
        ))}
        {topups.length === 0 ? <EmptyState title="Belum ada top-up" description="Riwayat top-up anak terpilih akan muncul di sini." /> : null}
      </div>
    </section>
  );
}

function CardSection({ child }: { child: ChildSummary }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Kartu</h2>
      <p className="mt-2 text-sm text-ink/65">Label: {child.card_label ?? "Belum ada kartu"} - UID: {child.card_uid ?? "-"} - Status: {child.card_status ?? "-"}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <form action={requestCardAction}>
          <input type="hidden" name="child_id" value={child.id} />
          <SubmitButton className="btn-secondary" pendingText="Mengajukan...">Ajukan Kartu</SubmitButton>
        </form>
        {child.card_id ? (
          <form action={updateCardStatusAction} className="flex gap-2">
            <input type="hidden" name="child_id" value={child.id} />
            <input type="hidden" name="card_id" value={child.card_id} />
            <select className="field" name="status" defaultValue="frozen"><option value="frozen">frozen</option><option value="blocked">blocked</option></select>
            <ConfirmSubmitButton className="btn-danger" message="Yakin ingin membekukan atau memblokir kartu ini?">Freeze/Block</ConfirmSubmitButton>
          </form>
        ) : null}
      </div>
    </section>
  );
}

function TransactionsSection({ transactions }: { transactions: ParentData["transactions"] }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Riwayat Transaksi</h2>
      <div className="mt-3 divide-y divide-line">
        {transactions.map((item) => <div className="py-3 text-sm" key={item.id}>{item.status} - {formatRupiah(Number(item.amount))} - {item.failure_reason ?? "success"} - {formatDateTime(item.created_at)}</div>)}
        {transactions.length === 0 ? <EmptyState title="Belum ada transaksi" description="Transaksi anak terpilih akan muncul di sini." /> : null}
      </div>
    </section>
  );
}

function SavingsSection({ childId, pockets }: { childId: string; pockets: ParentData["pockets"] }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Celengan</h2>
      <form action={createSavingsPocketAction} className="mt-3 grid gap-2 sm:grid-cols-[1fr_180px_auto]">
        <input type="hidden" name="child_id" value={childId} />
        <input className="field" name="name" placeholder="Nama celengan" required />
        <input className="field" name="target_amount" type="number" min={0} placeholder="Target" />
        <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Buat</SubmitButton>
      </form>
      <div className="mt-4 grid gap-3">
        {pockets.map((item) => <div className="rounded-3xl border border-line bg-white p-4 text-sm" key={item.id}>{item.name} - {formatRupiah(Number(item.current_amount))}/{formatRupiah(Number(item.target_amount))} - {item.status}</div>)}
        {pockets.length === 0 ? <EmptyState title="Belum ada celengan" description="Buat celengan untuk anak terpilih." /> : null}
      </div>
    </section>
  );
}

function RequestsSection({ requests }: { requests: ParentData["requests"] }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Saving Requests</h2>
      <div className="mt-3 divide-y divide-line">
        {requests.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm" key={item.id}>
            <span>{formatRupiah(Number(item.amount))} - {item.reason} - {item.payout_destination_type}</span><StatusBadge status={item.status} />
            {item.status === "pending" ? (
              <div className="flex gap-2">
                <form action={updateSavingRequestStatusAction}>
                  <input type="hidden" name="request_id" value={item.id} />
                  <input type="hidden" name="child_id" value={item.child_id} />
                  <input type="hidden" name="status" value="approved" />
                  <SubmitButton className="btn-secondary" pendingText="Menyetujui...">Setujui</SubmitButton>
                </form>
                <form action={updateSavingRequestStatusAction}>
                  <input type="hidden" name="request_id" value={item.id} />
                  <input type="hidden" name="child_id" value={item.child_id} />
                  <input type="hidden" name="status" value="rejected" />
                  <ConfirmSubmitButton message="Yakin ingin menolak request ini?">Tolak</ConfirmSubmitButton>
                </form>
              </div>
            ) : null}
          </div>
        ))}
        {requests.length === 0 ? <EmptyState title="Belum ada saving request" description="Pengajuan pencairan anak terpilih akan tampil di sini." /> : null}
      </div>
    </section>
  );
}

function MissionsSection({ childId, missions }: { childId: string; missions: ParentData["missions"] }) {
  return (
    <section className="panel rounded-lg p-5">
      <h2 className="text-lg font-black">Misi</h2>
      <form action={createMissionAction} className="mt-3 grid gap-2 sm:grid-cols-4">
        <input type="hidden" name="child_id" value={childId} />
        <input className="field" name="title" placeholder="Judul misi" required />
        <input className="field" name="description" placeholder="Deskripsi" />
        <input className="field" name="reward_amount" type="number" min={0} placeholder="Reward" />
        <SubmitButton className="btn-secondary" pendingText="Membuat...">Buat misi</SubmitButton>
      </form>
      <div className="mt-3 divide-y divide-line">
        {missions.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm" key={item.id}>
            <span>{item.title} - {item.description} - {formatRupiah(Number(item.reward_amount))}</span><StatusBadge status={item.status} />
            {item.status === "completed" ? (
              <form action={approveMissionAction}>
                <input type="hidden" name="mission_id" value={item.id} />
                <input type="hidden" name="child_id" value={item.child_id} />
                <input type="hidden" name="reward_amount" value={item.reward_amount} />
                <SubmitButton className="btn-secondary" pendingText="Menyetujui...">Approve reward</SubmitButton>
              </form>
            ) : null}
          </div>
        ))}
        {missions.length === 0 ? <EmptyState title="Belum ada misi" description="Buat misi sederhana untuk anak terpilih." /> : null}
      </div>
    </section>
  );
}
