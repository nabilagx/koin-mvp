import { resetChildPinAction, updateAdminChildProfileAction } from "@/app/actions/admin";
import { AppShell } from "@/components/AppShell";
import { PageNotice } from "@/components/PageNotice";
import { ReturnToInput } from "@/components/ReturnToInput";
import { SubmitButton } from "@/components/SubmitButton";
import { requireUser } from "@/lib/auth";
import { formatRupiah } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLinks } from "../nav";

export default async function AdminChildrenPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  const { data } = await createAdminClient()
    .from("children")
    .select("id,parent_id,user_id,name,school_name,grade,daily_limit,created_at,wallets(balance)")
    .order("created_at", { ascending: false });

  return (
    <AppShell user={user} title="Data Anak" navLinks={adminLinks} navTitle="Menu Admin">
      <PageNotice error={params.error} success={params.success} />
      <div className="grid gap-3">
        {(data ?? []).map((item) => (
          <div className="panel rounded-lg p-4 text-sm" key={item.id}>
            <p className="font-black">{item.name}</p>
            <p>{item.school_name ?? "-"} - {item.grade ?? "-"} - Limit Harian {formatRupiah(Number(item.daily_limit))} - Saldo {formatRupiah(Number(item.wallets?.[0]?.balance ?? 0))}</p>
            <form action={updateAdminChildProfileAction} className="mt-4 grid gap-2 rounded-3xl border border-line bg-white p-4 md:grid-cols-5">
              <ReturnToInput />
              <input type="hidden" name="child_id" value={item.id} />
              <input className="field" name="name" defaultValue={item.name} required />
              <input className="field" name="school_name" defaultValue={item.school_name ?? ""} placeholder="Sekolah" />
              <input className="field" name="grade" defaultValue={item.grade ?? ""} placeholder="Kelas" />
              <input className="field" name="daily_limit" type="number" min={0} defaultValue={Number(item.daily_limit)} />
              <SubmitButton className="btn-secondary" pendingText="Menyimpan profil...">Simpan Profil</SubmitButton>
            </form>
            <form action={resetChildPinAction} className="mt-3 flex flex-wrap gap-2">
              <ReturnToInput />
              <input type="hidden" name="child_id" value={item.id} />
              <input className="field max-w-56" name="pin" type="password" minLength={4} placeholder="PIN baru" required />
              <SubmitButton className="btn-secondary" pendingText="Mereset PIN...">Reset PIN</SubmitButton>
            </form>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
