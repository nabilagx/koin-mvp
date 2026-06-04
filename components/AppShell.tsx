import Link from "next/link";
import { Bell, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import type { AppUser } from "@/lib/types";
import { formatRole } from "@/lib/labels";
import { KoinBrand } from "./KoinBrand";
import { DesktopSidebar, MobileDrawer, type DashboardNavLink } from "./DashboardSidebar";
import { SubmitButton } from "./SubmitButton";

export function AppShell({
  user,
  title,
  navLinks,
  navTitle,
  children
}: {
  user: AppUser;
  title: string;
  navLinks?: DashboardNavLink[];
  navTitle?: string;
  children: React.ReactNode;
}) {
  const links = navLinks ?? getDefaultLinks(user.role);
  const menuTitle = navTitle ?? `Menu ${user.role}`;

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-6 px-4 py-4">
        <DesktopSidebar user={user} links={links} navTitle={menuTitle} logoutAction={logoutAction} />

        <section className="min-w-0 flex-1">
          <header className="koin-card sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <MobileDrawer user={user} links={links} navTitle={menuTitle} logoutAction={logoutAction} />
              <div className="min-w-0">
                <div className="xl:hidden"><KoinBrand href="/dashboard" /></div>
                <p className="hidden text-xs font-bold uppercase text-mint xl:block">Dashboard KOIN</p>
                <h1 className="mt-1 truncate text-2xl font-black sm:text-3xl">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden h-11 w-11 place-items-center rounded-2xl border border-line bg-white text-ink/70 sm:grid" type="button" aria-label="Notifikasi">
                <Bell size={18} />
              </button>
              <div className="hidden text-right text-sm md:block">
                <p className="font-black">{user.name}</p>
                <p className="text-ink/55">{formatRole(user.role)}</p>
              </div>
              <form action={logoutAction}>
                <SubmitButton className="btn-secondary" pendingText="Keluar...">
                  <LogOut size={16} />
                  Keluar
                </SubmitButton>
              </form>
            </div>
          </header>
          <div>{children}</div>
          <footer className="mt-10 pb-6 text-center text-xs font-semibold text-ink/45">
            <Link href="/">KOIN</Link> - Kenali - Olah - Ingat - Nabung
          </footer>
        </section>
      </div>
    </main>
  );
}

function getDefaultLinks(role: AppUser["role"]): DashboardNavLink[] {
  if (role === "ADMIN") {
    return [
      { href: "/dashboard/admin", label: "Ringkasan" },
      { href: "/dashboard/admin/users", label: "Pengguna" },
      { href: "/dashboard/admin/parents", label: "Orang Tua" },
      { href: "/dashboard/admin/children", label: "Anak" },
      { href: "/dashboard/admin/canteens", label: "Kantin" },
      { href: "/dashboard/admin/cards", label: "Kartu" },
      { href: "/dashboard/admin/transactions", label: "Transaksi" },
      { href: "/dashboard/admin/topups", label: "Top Up" },
      { href: "/dashboard/admin/audit-logs", label: "Log Aktivitas" },
      { href: "/dashboard/admin/support", label: "Laporan Kendala" },
      { href: "/dashboard/admin?view=ai", label: "AI Insight Segera Hadir" },
      { href: "/dashboard/admin?view=settings", label: "Pengaturan" }
    ];
  }
  if (role === "CHILD") {
    return [
      { href: "/dashboard/child", label: "Ringkasan" },
      { href: "/dashboard/child?view=saldo", label: "Saldo & Limit" },
      { href: "/dashboard/child?view=transactions", label: "Riwayat Transaksi" },
      { href: "/dashboard/child?view=savings", label: "Celengan" },
      { href: "/dashboard/child?view=requests", label: "Pengajuan Pencairan" },
      { href: "/dashboard/child?view=missions", label: "Misi" },
      { href: "/dashboard/child?view=support", label: "Lapor Admin" },
      { href: "/dashboard/child?view=ai", label: "AI Insight Segera Hadir" }
    ];
  }
  if (role === "CANTEEN") {
    return [
      { href: "/dashboard/canteen", label: "POS Kantin" },
      { href: "/dashboard/canteen?view=products", label: "Produk/Menu" },
      { href: "/dashboard/canteen?view=transactions", label: "Transaksi Hari Ini" },
      { href: "/dashboard/canteen?view=recap", label: "Rekap Penjualan" },
      { href: "/dashboard/canteen?view=support", label: "Lapor Admin" },
      { href: "/dashboard/canteen?view=ai", label: "AI Insight Segera Hadir" },
      { href: "/dashboard/canteen?view=settings", label: "Pengaturan" }
    ];
  }
  return [
    { href: "/dashboard/parent", label: "Ringkasan" },
    { href: "/dashboard/parent?view=children", label: "Anak Saya" },
    { href: "/dashboard/parent?view=saldo", label: "Saldo & Limit" },
    { href: "/dashboard/parent?view=topup", label: "Top Up" },
    { href: "/dashboard/parent?view=cards", label: "Kartu" },
    { href: "/dashboard/parent?view=savings", label: "Celengan" },
    { href: "/dashboard/parent?view=requests", label: "Pengajuan Pencairan" },
    { href: "/dashboard/parent?view=missions", label: "Misi" },
    { href: "/dashboard/parent?view=transactions", label: "Riwayat Transaksi" },
    { href: "/dashboard/parent?view=support", label: "Lapor Admin" },
    { href: "/dashboard/parent?view=ai", label: "AI Insight Segera Hadir" },
    { href: "/dashboard/parent?view=settings", label: "Pengaturan" }
  ];
}
