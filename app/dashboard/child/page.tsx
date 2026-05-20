import { createChildSavingsPocketAction, createSavingRequestAction, moveWalletToSavingsAction, submitMissionAction } from "@/app/actions/child";
import { AppShell } from "@/components/AppShell";
import { DashboardNav } from "@/components/DashboardNav";
import { PageNotice } from "@/components/PageNotice";
import { SubmitButton } from "@/components/SubmitButton";
import { SupportReportPanel } from "@/components/SupportReportPanel";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/format";
import { getDailyLimitUsage } from "@/lib/limits";
import { createAdminClient } from "@/lib/supabase/admin";

async function getChildData(user_id: string) {
  const admin = createAdminClient();
  const { data: child } = await admin
    .from("children")
    .select("id,parent_id,user_id,name,school_name,grade,daily_limit,cards(id,card_uid,card_label,status),wallets(balance)")
    .eq("user_id", user_id)
    .single();

  if (!child) return null;

  const { data: transactions } = await admin
    .from("transactions")
    .select("id,child_id,canteen_id,card_id,amount,status,failure_reason,created_at,canteens(canteen_name)")
    .eq("child_id", child.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: pockets } = await admin
    .from("savings_pockets")
    .select("id,child_id,name,target_amount,current_amount,status,created_at")
    .eq("child_id", child.id)
    .order("created_at", { ascending: false });

  const { data: requests } = await admin
    .from("saving_requests")
    .select("id,saving_pocket_id,child_id,parent_id,amount,reason,status,payout_destination_type,created_at")
    .eq("child_id", child.id)
    .order("created_at", { ascending: false });

  const { data: missions } = await admin
    .from("missions")
    .select("id,child_id,parent_id,title,description,reward_amount,status,evidence_text,evidence_url,submitted_at,approved_at,created_at")
    .eq("child_id", child.id)
    .order("created_at", { ascending: false });

  const { data: support_reports } = await admin
    .from("support_reports")
    .select("id,subject,message,status,admin_reply,related_transaction_id,created_at")
    .eq("reporter_user_id", user_id)
    .order("created_at", { ascending: false });

  const usage = await getDailyLimitUsage(admin, child.id, child.daily_limit);

  return { child, transactions: transactions ?? [], usage, pockets: pockets ?? [], requests: requests ?? [], missions: missions ?? [], support_reports: support_reports ?? [] };
}

export default async function ChildDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireUser(["CHILD"]);
  const params = await searchParams;
  const data = await getChildData(user.id);

  return (
    <AppShell user={user} title="Child Dashboard">
      <DashboardNav links={[{ href: "/dashboard/child", label: "Ringkasan Anak" }]} />
      <PageNotice error={params.error} success={params.success} />
      {!data ? (
        <div className="panel rounded-lg p-6 text-sm text-ink/65">Profil child belum tersedia.</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="panel rounded-lg p-5">
            <h2 className="text-lg font-black">{data.child.name}</h2>
            <p className="text-sm text-ink/60">{data.child.school_name ?? "school_name belum diisi"} - {data.child.grade ?? "grade belum diisi"}</p>
            <p className="mt-5 text-sm font-semibold text-ink/60">Saldo jajan</p>
            <p className="text-4xl font-black">{formatRupiah(Number(data.child.wallets?.[0]?.balance ?? 0))}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-line p-3"><p className="text-ink/55">Daily limit</p><p className="font-black">{formatRupiah(data.usage.daily_limit)}</p></div>
              <div className="rounded-md border border-line p-3"><p className="text-ink/55">Jajan hari ini</p><p className="font-black">{formatRupiah(data.usage.spent_today)}</p></div>
              <div className="rounded-md border border-line p-3"><p className="text-ink/55">Tabungan hari ini</p><p className="font-black">{formatRupiah(data.usage.saved_today)}</p></div>
              <div className="rounded-md border border-line p-3"><p className="text-ink/55">Sisa limit hari ini</p><p className="font-black">{formatRupiah(data.usage.remaining_today)}</p></div>
              <div className="rounded-md border border-line p-3"><p className="text-ink/55">Kartu</p><div className="mt-1"><StatusBadge status={data.child.cards?.[0]?.status ?? "Belum punya kartu"} /></div></div>
            </div>

            <h3 className="mt-6 font-black">Buat target Celengan KOIN</h3>
            <form action={createChildSavingsPocketAction} className="mt-3 flex gap-2">
              <input className="field" name="name" placeholder="Nama celengan" required />
              <input className="field" name="target_amount" type="number" min={0} placeholder="Target" />
              <SubmitButton className="btn-secondary" pendingText="Menyimpan...">Buat</SubmitButton>
            </form>
          </section>

          <section className="grid gap-6">
            <div className="panel rounded-lg p-5">
              <h2 className="text-lg font-black">Riwayat Transaksi</h2>
              <div className="mt-3 divide-y divide-line">
                {data.transactions.map((transaction) => (
                  <div className="flex justify-between gap-3 py-3 text-sm" key={transaction.id}>
                    <span>{transaction.status} - {transaction.failure_reason ?? "success"} - {formatDateTime(transaction.created_at)}</span>
                    <strong>{formatRupiah(Number(transaction.amount))}</strong>
                  </div>
                ))}
                {data.transactions.length === 0 ? <EmptyState title="Belum ada transaksi" description="Riwayat jajan akan muncul setelah kartu digunakan di kantin." /> : null}
              </div>
            </div>

            <div className="panel rounded-lg p-5">
              <h2 className="text-lg font-black">Celengan</h2>
              <p className="mt-1 text-sm text-ink/60">Maksimal pindah saldo hari ini mengikuti sisa limit harian.</p>
              <div className="mt-3 grid gap-3">
                {data.pockets.map((pocket) => (
                  <div className="rounded-md border border-line p-3" key={pocket.id}>
                    <p className="font-semibold">{pocket.name}</p>
                    <p className="text-sm text-ink/60">{formatRupiah(Number(pocket.current_amount))}/{formatRupiah(Number(pocket.target_amount))} - {pocket.status}</p>
                    <form action={moveWalletToSavingsAction} className="mt-3 flex gap-2">
                      <input type="hidden" name="saving_pocket_id" value={pocket.id} />
                      <input className="field" name="amount" type="number" min={1} placeholder="Pindah saldo" />
                      <SubmitButton className="btn-secondary" pendingText="Memindahkan...">Pindah</SubmitButton>
                    </form>
                    <form action={createSavingRequestAction} className="mt-3 grid gap-2 sm:grid-cols-4">
                      <input type="hidden" name="saving_pocket_id" value={pocket.id} />
                      <input className="field" name="amount" type="number" min={1} placeholder="Cairkan" />
                      <input className="field" name="reason" placeholder="Alasan" />
                      <select className="field" name="payout_destination_type" defaultValue="Minta orang tua transfer">
                        <option>Minta orang tua transfer</option>
                        <option>Digunakan langsung</option>
                        <option>Tunai dari orang tua</option>
                      </select>
                      <SubmitButton className="btn-secondary" pendingText="Mengajukan...">Ajukan pencairan</SubmitButton>
                    </form>
                  </div>
                ))}
                {data.pockets.length === 0 ? <EmptyState title="Belum ada celengan" description="Buat target pertama untuk mulai belajar menabung." /> : null}
              </div>
            </div>

            <div className="panel rounded-lg p-5">
              <h2 className="text-lg font-black">Saving Requests</h2>
              <div className="mt-3 divide-y divide-line">
                {data.requests.map((item) => <div className="flex items-center justify-between gap-3 py-3 text-sm" key={item.id}><span>{formatRupiah(Number(item.amount))} - {item.reason} - {item.payout_destination_type}</span><StatusBadge status={item.status} /></div>)}
                {data.requests.length === 0 ? <EmptyState title="Belum ada request" description="Pengajuan pencairan celengan akan tampil di sini." /> : null}
              </div>
            </div>

            <div className="panel rounded-lg p-5">
              <h2 className="text-lg font-black">Misi</h2>
              <div className="mt-3 divide-y divide-line">
                {data.missions.map((item) => (
                  <div className="py-3 text-sm" key={item.id}>
                    <div className="flex flex-wrap items-center justify-between gap-3"><p>{item.title} - {item.description} - {formatRupiah(Number(item.reward_amount))}</p><StatusBadge status={item.status} /></div>
                    {item.status === "pending" ? (
                      <form action={submitMissionAction} className="mt-3 grid gap-2 sm:grid-cols-3">
                        <input type="hidden" name="mission_id" value={item.id} />
                        <input className="field" name="evidence_text" placeholder="Keterangan bukti" />
                        <input className="field" name="evidence_url" placeholder="URL bukti opsional" />
                        <SubmitButton className="btn-secondary" pendingText="Submit...">Submit Misi</SubmitButton>
                      </form>
                    ) : null}
                  </div>
                ))}
                {data.missions.length === 0 ? <EmptyState title="Belum ada misi" description="Misi dari orang tua akan muncul di sini." /> : null}
              </div>
            </div>

            <SupportReportPanel transactions={data.transactions} reports={data.support_reports} />
          </section>
        </div>
      )}
    </AppShell>
  );
}
