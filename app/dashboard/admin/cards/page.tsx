import { updateAdminCardStatusAction } from "@/app/actions/admin";
import { AdminNfcCardManager } from "@/components/AdminNfcCardManager";
import { AppShell } from "@/components/AppShell";
import { PageNotice } from "@/components/PageNotice";
import { StatusBadge } from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminCardsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  const { data } = await createAdminClient()
    .from("cards")
    .select("id,child_id,card_uid,card_label,status,created_at,children(child_id:id,name)")
    .order("created_at", { ascending: false });
  const { data: children } = await createAdminClient()
    .from("children")
    .select("id,name")
    .order("name", { ascending: true });

  return (
    <AppShell user={user} title="Admin Cards">
      <PageNotice error={params.error} success={params.success} />
      <AdminNfcCardManager childOptions={children ?? []} />
      <div className="grid gap-3">
        {(data ?? []).map((item) => {
          const child = Array.isArray(item.children) ? item.children[0] : item.children;
          return (
            <div className="panel rounded-lg p-4 text-sm" key={item.id}>
              <p className="font-black">{item.card_uid} · {item.card_label ?? "-"}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2"><span>{child?.name ?? item.child_id}</span><StatusBadge status={item.status} /></div>
              <form action={updateAdminCardStatusAction} className="mt-3 flex gap-2">
                <input type="hidden" name="card_id" value={item.id} />
                <select className="field max-w-44" name="status" defaultValue={item.status}><option value="active">active</option><option value="blocked">blocked</option><option value="frozen">frozen</option><option value="replaced">replaced</option></select>
                <button className="btn-secondary">Update status</button>
              </form>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
