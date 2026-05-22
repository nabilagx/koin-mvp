"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import type { AppUser } from "@/lib/types";
import { KoinBrand } from "./KoinBrand";
import { StatusBadge } from "./StatusBadge";

export type DashboardNavLink = {
  href: string;
  label: string;
};

function useActiveHref() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const currentChild = searchParams.get("child_id");

  return (href: string) => {
    const [path, query = ""] = href.split("?");
    const params = new URLSearchParams(query);
    const linkView = params.get("view");
    const linkChild = params.get("child_id");
    if (path !== pathname) return false;
    if (linkView || currentView) return linkView === currentView;
    if (linkChild || currentChild) return linkChild === currentChild;
    return true;
  };
}

function NavList({ links, onNavigate }: { links: DashboardNavLink[]; onNavigate?: () => void }) {
  const isActive = useActiveHref();
  return (
    <nav className="grid gap-1.5">
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            className={`flex min-h-12 items-center rounded-2xl px-4 py-3 text-sm font-black transition ${
              active ? "bg-gold/35 text-ink shadow-sm" : "text-ink/65 hover:bg-lilac hover:text-mint"
            }`}
            href={link.href}
            key={link.href}
            onClick={onNavigate}
          >
            <span className="block truncate">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  user,
  links,
  navTitle,
  logoutAction,
  onNavigate
}: {
  user: AppUser;
  links: DashboardNavLink[];
  navTitle: string;
  logoutAction: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      <KoinBrand href="/dashboard" />
      <div className="mt-6 rounded-3xl bg-lilac/70 p-4">
        <p className="text-sm font-black">{user.name}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <StatusBadge status={user.role} />
          <span className="text-xs font-bold text-ink/50">{user.status}</span>
        </div>
      </div>
      <p className="mt-6 px-2 text-xs font-bold uppercase text-mint">{navTitle}</p>
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <NavList links={links} onNavigate={onNavigate} />
      </div>
      <div className="mt-5 rounded-3xl bg-ink p-4 text-white">
        <div className="flex items-center gap-2 text-gold">
          <Sparkles size={18} />
          <span className="text-sm font-black">Demo KOIN</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-white/70">Smart school wallet untuk uang saku, kantin, kartu, dan celengan.</p>
      </div>
      <form action={logoutAction} className="mt-3">
        <button className="btn-secondary w-full justify-center" type="submit">
          <LogOut size={16} />
          Keluar
        </button>
      </form>
    </>
  );
}

export function DesktopSidebar({
  user,
  links,
  navTitle,
  logoutAction
}: {
  user: AppUser;
  links: DashboardNavLink[];
  navTitle: string;
  logoutAction: () => void;
}) {
  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-80 shrink-0 rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-soft backdrop-blur xl:flex xl:flex-col">
      <SidebarContent user={user} links={links} navTitle={navTitle} logoutAction={logoutAction} />
    </aside>
  );
}

export function MobileDrawer({
  user,
  links,
  navTitle,
  logoutAction
}: {
  user: AppUser;
  links: DashboardNavLink[];
  navTitle: string;
  logoutAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint text-white shadow-soft xl:hidden"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buka menu dashboard"
      >
        <Menu size={22} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] xl:hidden">
          <button className="absolute inset-0 z-0 bg-ink/55 backdrop-blur-[1px]" type="button" onClick={() => setOpen(false)} aria-label="Tutup menu" />
          <aside className="fixed inset-y-0 left-0 z-10 flex h-[100dvh] max-h-[100dvh] w-[280px] max-w-[88vw] flex-col overflow-hidden rounded-r-[2rem] bg-white p-5 shadow-glow">
            <div className="mb-2 flex shrink-0 justify-end">
              <button className="grid h-11 w-11 place-items-center rounded-2xl bg-lilac text-mint" type="button" onClick={() => setOpen(false)} aria-label="Tutup menu">
                <X size={20} />
              </button>
            </div>
            <SidebarContent user={user} links={links} navTitle={navTitle} logoutAction={logoutAction} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
