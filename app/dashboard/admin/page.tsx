import { AppShell } from "@/components/AppShell";
import { AiComingSoon } from "@/components/AiComingSoon";
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

const summaryLabels: Record<string, string> = {
  users: "Pengguna",
  parents: "Orang Tua",
  children: "Anak",
  canteens: "Kantin",
  cards: "Kartu",
  transactions: "Transaksi",
  topup_transactions: "Top Up",
  support_reports: "Laporan Kendala",
  audit_logs: "Log Aktivitas"
};

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const user = await requireUser(["ADMIN"]);
  const params = await searchParams;
  const counts = await getCounts();

  return (
    <AppShell user={user} title="Admin Dashboard" navLinks={adminLinks} navTitle="Menu Admin">
      {params.view === "ai" ? (
        <AiComingSoon
          title="AI Insight Sekolah"
          description="Fitur ini akan membantu admin melihat pola transaksi agregat, aktivitas kantin, dan laporan sekolah."
          items={["Pola transaksi agregat", "Aktivitas kantin", "Laporan sekolah", "Anomali operasional"]}
        />
      ) : params.view === "settings" ? (
        <section className="panel rounded-lg p-6">
          <h2 className="text-2xl font-black">Pengaturan</h2>
          <p className="mt-3 text-sm leading-6 text-ink/65">Pengaturan operasional admin akan disusun bertahap. Untuk MVP, konfigurasi penting masih dikelola melalui Supabase dan halaman role yang tersedia.</p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {counts.map(([table, count]) => (
            <div className="panel rounded-lg p-5" key={table}>
              <p className="text-sm font-semibold uppercase tracking-wide text-ink/55">{summaryLabels[table] ?? table}</p>
              <p className="mt-3 text-3xl font-black">{count}</p>
            </div>
          ))}
        </section>
      )}
    </AppShell>
  );
}
