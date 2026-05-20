import type { ReactNode } from "react";
import { CreditCard, Radio, ShieldCheck } from "lucide-react";
import { KoinBrand } from "./KoinBrand";

export function AuthFrame({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white/90 shadow-glow lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden min-h-[680px] overflow-hidden bg-ink p-10 text-white lg:block">
          <div className="absolute -right-12 top-10 h-44 w-44 rounded-full bg-gold/90 blur-sm" />
          <div className="absolute -left-8 bottom-24 h-32 w-32 rounded-full border-[18px] border-mint/60" />
          <div className="relative z-10">
            <KoinBrand href="/" />
            <p className="mt-10 text-4xl font-black leading-tight">Uang saku aman untuk sekolah yang lebih cerdas.</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">KOIN membantu orang tua memantau, anak belajar nabung, dan kantin menerima transaksi kartu NFC/RFID.</p>
          </div>
          <div className="relative z-10 mt-12 rounded-[2rem] bg-white/12 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">KOIN CARD</span>
              <CreditCard />
            </div>
            <p className="mt-20 text-4xl font-black">KOIN</p>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-sm text-white/70">Smart school wallet</span>
              <span className="flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-black text-ink"><Radio size={14} /> NFC</span>
            </div>
          </div>
          <div className="relative z-10 mt-6 rounded-3xl bg-white/12 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-gold" />
              <p className="text-sm text-white/75">Limit harian, kartu, celengan, dan riwayat transaksi dalam satu ekosistem.</p>
            </div>
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <KoinBrand href="/" />
          <h1 className="mt-10 text-3xl font-black">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-ink/60">{subtitle}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
