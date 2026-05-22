import { updateCanteenStatusAction } from "@/app/actions/admin";
import { AppShell } from "@/components/AppShell";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { PageNotice } from "@/components/PageNotice";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminCanteensPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  const { data } = await createAdminClient()
    .from("canteens")
    .select("id,user_id,canteen_name,owner_name,school_name,phone,has_nfc_device,status,created_at")
    .order("created_at", { ascending: false });

  return (
    <AppShell user={user} title="Admin Canteens">
      <PageNotice error={params.error} success={params.success} />
      <div className="grid gap-3">{(data ?? []).map((item) => <div className="panel rounded-lg p-4 text-sm" key={item.id}><p className="font-black">{item.canteen_name}</p><p>{item.owner_name} · {item.school_name ?? "-"} · NFC {String(item.has_nfc_device)} · {item.status}</p><form action={updateCanteenStatusAction} className="mt-3 flex gap-2"><input type="hidden" name="canteen_id" value={item.id} /><select className="field max-w-44" name="status" defaultValue={item.status}><option value="pending">pending</option><option value="active">active</option><option value="suspended">suspended</option></select><ConfirmSubmitButton message="Yakin ingin mengubah status kantin ini?">Update status</ConfirmSubmitButton></form></div>)}</div>
    </AppShell>
  );
}
