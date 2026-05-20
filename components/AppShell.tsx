import Link from "next/link";
import { Bell, LogOut, Sparkles } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import type { AppUser } from "@/lib/types";
import { KoinBrand } from "./KoinBrand";
import { StatusBadge } from "./StatusBadge";

export function AppShell({
  user,
  title,
  children
}: {
  user: AppUser;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-6 px-4 py-4">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-soft backdrop-blur lg:flex lg:flex-col">
          <KoinBrand href="/dashboard" />
          <div className="mt-8 rounded-3xl bg-lilac/70 p-4">
            <p className="text-sm font-black">{user.name}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <StatusBadge status={user.role} />
              <span className="text-xs font-bold text-ink/50">{user.status}</span>
            </div>
          </div>
          <div className="mt-auto rounded-3xl bg-ink p-4 text-white">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles size={18} />
              <span className="text-sm font-black">Demo KOIN</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/70">Smart school wallet untuk uang saku, kantin, kartu, dan celengan.</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="koin-card sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <div className="lg:hidden"><KoinBrand href="/dashboard" /></div>
              <p className="hidden text-xs font-bold uppercase text-mint lg:block">Dashboard KOIN</p>
              <h1 className="mt-1 truncate text-2xl font-black sm:text-3xl">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden h-11 w-11 place-items-center rounded-2xl border border-line bg-white text-ink/70 sm:grid" type="button" aria-label="Notifikasi">
                <Bell size={18} />
              </button>
              <div className="hidden text-right text-sm md:block">
                <p className="font-black">{user.name}</p>
                <p className="text-ink/55">{user.role}</p>
              </div>
              <form action={logoutAction}>
                <button className="btn-secondary" type="submit">
                  <LogOut size={16} />
                  Keluar
                </button>
              </form>
            </div>
          </header>
          <div>{children}</div>
          <footer className="mt-10 pb-6 text-center text-xs font-semibold text-ink/45">
            <Link href="/">KOIN</Link> · Kenali • Olah • Ingat • Nabung
          </footer>
        </section>
      </div>
    </main>
  );
}
