import { AppShell } from "@/components/AppShell";
import { DashboardNav } from "@/components/DashboardNav";
import { PageNotice } from "@/components/PageNotice";
import { resetChildPinAction } from "@/app/actions/admin";
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
    <AppShell user={user} title="Admin Children">
      <DashboardNav links={adminLinks} />
      <PageNotice error={params.error} success={params.success} />
      <div className="grid gap-3">{(data ?? []).map((item) => <div className="panel rounded-lg p-4 text-sm" key={item.id}><p className="font-black">{item.name}</p><p>{item.school_name ?? "-"} · {item.grade ?? "-"} · daily_limit {formatRupiah(Number(item.daily_limit))} · saldo {formatRupiah(Number(item.wallets?.[0]?.balance ?? 0))}</p><form action={resetChildPinAction} className="mt-3 flex gap-2"><input type="hidden" name="child_id" value={item.id} /><input className="field max-w-56" name="pin" type="password" minLength={4} placeholder="PIN baru" required /><button className="btn-secondary">Reset PIN</button></form></div>)}</div>
    </AppShell>
  );
}
