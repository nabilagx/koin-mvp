import { AppShell } from "@/components/AppShell";
import { DashboardNav } from "@/components/DashboardNav";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLinks } from "./nav";

async function getCounts() {
  const admin = createAdminClient();
  const tables = ["users", "parents", "children", "canteens", "cards", "transactions", "topup_transactions", "support_reports", "audit_logs"];
  return Promise.all(tables.map(async (table) => {
    const { count } = await admin.from(table).select("*", { count: "exact", head: true });
    return [table, count ?? 0] as const;
  }));
}

export default async function AdminDashboardPage() {
  const user = await requireUser(["ADMIN"]);
  const counts = await getCounts();

  return (
    <AppShell user={user} title="Admin Dashboard">
      <DashboardNav links={adminLinks} />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counts.map(([table, count]) => (
          <div className="panel rounded-lg p-5" key={table}>
            <p className="text-sm font-semibold uppercase tracking-wide text-ink/55">{table}</p>
            <p className="mt-3 text-3xl font-black">{count}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
