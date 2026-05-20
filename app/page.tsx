import Link from "next/link";
import { ArrowRight, BadgeCheck, Ban, BookOpenCheck, Clock, CreditCard, History, Radio, School, ShieldCheck, Smartphone, Store, Users, WalletCards } from "lucide-react";
import { KoinBrand } from "@/components/KoinBrand";

const schools = ["SMP Nusantara", "SD Harapan Bangsa", "SMP 2 JAYA"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#10233f]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <KoinBrand />
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-secondary">Login</Link>
          <Link href="/register/parent" className="btn-primary">Daftar</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-10 pt-8 md:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p className="text-sm font-bold uppercase text-[#1c77d2]">Kenali • Olah • Ingat • Nabung</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight sm:text-6xl">KOIN</h1>
          <p className="mt-4 text-2xl font-bold text-[#17375f]">Kartu uang saku pintar untuk ekosistem sekolah.</p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#304866]">
            Orang tua memantau, anak belajar mengelola uang, kantin bertransaksi lebih aman.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register/parent" className="btn-primary">
              Daftar sebagai Parent
              <ArrowRight size={16} />
            </Link>
            <Link href="/register/canteen" className="btn-secondary">Daftar Kantin</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-[#304866]">
            {["Bank Indonesia", "OJK", "PIDI Digdaya"].map((item) => (
              <span className="rounded-full border border-[#dbeafe] bg-white px-4 py-2" key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px]">
          <div className="absolute right-5 top-0 h-24 w-24 rounded-full bg-[#ffd84d]" />
          <div className="absolute left-8 top-12 h-10 w-10 rounded-full bg-[#88d8ff]" />
          <div className="absolute bottom-16 left-0 h-16 w-16 rounded-full border-8 border-[#ffd84d]" />
          <div className="panel relative mx-auto mt-8 max-w-md rounded-2xl p-5">
            <div className="rounded-2xl bg-[#10233f] p-6 text-white shadow-soft">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">KOIN CARD</span>
                <CreditCard size={24} />
              </div>
              <p className="mt-12 text-3xl font-black">KOIN</p>
              <p className="mt-2 text-sm text-white/70">Tap NFC/RFID di kantin sekolah</p>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm text-white/70">**** 2026</span>
                <span className="flex items-center gap-2 rounded-full bg-[#ffd84d] px-3 py-1 text-xs font-bold text-[#10233f]"><Radio size={14} /> NFC</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#dbeafe] p-4">
                <WalletCards className="text-[#1c77d2]" size={24} />
                <p className="mt-4 text-sm text-[#58708e]">Saldo anak</p>
                <p className="text-xl font-black">Rp125.000</p>
              </div>
              <div className="rounded-xl border border-[#dbeafe] p-4">
                <ShieldCheck className="text-[#1f9d68]" size={24} />
                <p className="mt-4 text-sm text-[#58708e]">Sisa limit</p>
                <p className="text-xl font-black">Rp20.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 md:grid-cols-5">
          {[
            ["Limit harian", Clock],
            ["Transaksi kantin", Store],
            ["Celengan KOIN", WalletCards],
            ["Blokir kartu", Ban],
            ["Riwayat transaksi", History]
          ].map(([label, Icon]) => (
            <div className="koin-card p-5 text-center" key={String(label)}>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-lilac text-mint">
                <Icon size={22} />
              </div>
              <p className="mt-3 text-sm font-black">{String(label)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="koin-card p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-mint">Ekosistem KOIN di sekolah</p>
              <h2 className="mt-2 text-3xl font-black">Satu alur untuk semua role</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ink/60">Orang tua mengatur, anak memakai dan menabung, kantin memproses transaksi, admin menjaga operasional tetap rapi.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Orang Tua", "Top-up, limit, kartu, celengan", Users],
              ["Anak", "Jajan aman dan belajar nabung", BookOpenCheck],
              ["Kantin", "POS sederhana berbasis kartu", Store],
              ["Admin", "Monitoring, laporan, audit", ShieldCheck]
            ].map(([title, desc, Icon]) => (
              <div className="rounded-3xl border border-line bg-white p-5" key={String(title)}>
                <Icon className="text-mint" size={26} />
                <p className="mt-4 font-black">{String(title)}</p>
                <p className="mt-2 text-sm leading-6 text-ink/60">{String(desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-10 lg:grid-cols-[1fr_0.8fr]">
        <div className="koin-card p-6">
          <p className="text-sm font-black uppercase text-mint">Keunggulan KOIN</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {["Aman dan terpercaya", "Tanpa uang tunai", "Transparan untuk orang tua", "Mendidik anak disiplin menabung", "Mudah digunakan", "Bisa diakses semua perangkat"].map((item) => (
              <div className="flex items-center gap-3 rounded-2xl bg-lilac/60 p-4" key={item}>
                <BadgeCheck className="text-leaf" size={22} />
                <span className="font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="koin-card p-6">
          <Smartphone className="text-mint" size={32} />
          <h2 className="mt-4 text-2xl font-black">Akses multi-device / PWA</h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">KOIN bisa dipakai dari browser sekolah, laptop admin, tablet kantin, dan ponsel orang tua tanpa instalasi rumit.</p>
          <div className="mt-6 rounded-3xl border border-line bg-white p-4 text-sm font-semibold text-ink/70">Tambahkan ke layar utama untuk pengalaman seperti aplikasi.</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          {schools.map((school) => (
            <div className="panel rounded-2xl p-5" key={school}>
              <School className="text-[#1c77d2]" size={24} />
              <p className="mt-4 text-sm font-semibold text-[#58708e]">Sekolah Pilot / Sekolah Kerja Sama</p>
              <p className="mt-1 text-lg font-black">{school}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t border-line bg-white/70 px-5 py-8 text-center text-sm font-semibold text-ink/55">
        <p className="font-black text-ink">KOIN</p>
        <p className="mt-1">Kenali • Olah • Ingat • Nabung</p>
      </footer>
    </main>
  );
}
