import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Clock,
  CreditCard,
  History,
  Radio,
  School,
  ShieldCheck,
  Store,
  Users,
  WalletCards,
  Sparkles,
  TrendingUp,
  Star,
  PiggyBank,
  CheckCircle2,
} from "lucide-react";

import { KoinBrand } from "@/components/KoinBrand";

const schools = [
  {
    name: "SMPN 2 Ambulu",
    status: "Pilot Aktif",
    desc: "Sekolah pertama peneru rintisan ekosistem uang saku digital berbasis NFC.",
  },
  {
    name: "SMPN 1 Jember",
    status: "Segera Hadir",
    desc: "Tahap koordinasi & pemetaan sarana kantin sehat bebas tunai.",
  },
  {
    name: "SD Al-Amin",
    status: "Segera Hadir",
    desc: "Sosialisasi awal sistem tabungan siswa terintegrasi wali murid.",
  },
  {
    name: "Kantin Sehat Mandiri",
    status: "Segera Hadir",
    desc: "Digitalisasi pembayaran stand makanan sehat dalam satu kartu.",
  },
];

const stats = [
  {
    title: "Sekolah Pilot",
    value: "1",
    icon: School,
    badge: "Active",
  },
  {
    title: "Role Pengguna",
    value: "4",
    icon: Users,
    badge: "Terintegrasi",
  },
  {
    title: "Transaksi Cashless",
    value: "100%",
    icon: WalletCards,
    badge: "Aman",
  },
  {
    title: "NFC Engine Ready",
    value: "24/7",
    icon: Radio,
    badge: "Realtime",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#10233f] overflow-hidden selection:bg-[#ffd84d]/30">
      
      {      /* ================= NAVIGATION ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#dbeafe] bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <KoinBrand />

          <div className="hidden items-center gap-8 font-semibold text-[#58708e] lg:flex">
            <a
              href="#fitur"
              className="relative py-1 transition hover:text-[#1c77d2] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#1c77d2] after:transition-all"
            >
              Fitur
            </a>

            <a
              href="#ekosistem"
              className="relative py-1 transition hover:text-[#1c77d2] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#1c77d2] after:transition-all"
            >
              Ekosistem
            </a>

            <a
              href="#pilot"
              className="relative py-1 transition hover:text-[#1c77d2] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#1c77d2] after:transition-all"
            >
              Pilot
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-[#dbeafe] bg-white px-5 py-2.5 font-bold text-[#304866] transition hover:bg-[#f7fbff] hover:shadow-sm"
            >
              Masuk
            </Link>

            <Link
              href="/register/parent"
              className="group relative overflow-hidden rounded-xl bg-[#1c77d2] px-6 py-2.5 font-bold text-white shadow-md shadow-[#1c77d2]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#1c77d2]/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Daftar Sekarang
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

        </div>
      </nav>

      {      /* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden py-16 lg:py-24">

        {/* Floating Decorative Blur Blobs */}
        <div className="absolute left-[-10%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#dbeafe]/40 blur-[120px]" />
        <div className="absolute right-[-5%] top-[5%] h-[350px] w-[350px] rounded-full bg-[#ffd84d]/15 blur-[100px]" />
        <div className="absolute right-[40%] bottom-[-5%] h-[250px] w-[250px] rounded-full bg-[#e9e3ff]/60 blur-[90px]" /> {/* Lilac Accent Spot */}

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12">

          {/* LEFT: CTA, BADGES, AND HEADLINES */}
          <div className="lg:col-span-7">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-white px-4 py-2 text-xs font-bold text-[#10233f] shadow-sm">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#1f9d68] animate-pulse" />
              <Sparkles size={14} className="text-[#ffd84d]" />
              Pilot Project • SMPN 2 Ambulu
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.15] text-[#10233f] sm:text-5xl lg:text-6xl xl:text-7xl">
              Digital Pocket
              <br />
              <span className="relative inline-block text-white">
                <span className="absolute inset-0 -skew-y-1 bg-[#1c77d2] rounded-lg shadow-md shadow-[#1c77d2]/10" />
                <span className="relative px-3 py-1">Money</span>
              </span>
              <span className="text-[#1c77d2]"> for Smart</span>
              <br />
              Schools.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#58708e] sm:text-lg">
              KOIN membantu sekolah membangun ekosistem uang saku digital berbasis kartu NFC yang aman, transparan, serta mengajarkan literasi finansial bijak sejak dini kepada anak Anda.
            </p>

            {/* Main Action Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register/parent"
                className="flex items-center gap-2 rounded-2xl bg-[#1c77d2] px-8 py-4 font-extrabold text-white shadow-lg shadow-[#1c77d2]/25 transition hover:scale-105 hover:bg-[#1a6cb3] hover:shadow-xl"
              >
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/register/canteen"
                className="rounded-2xl border border-[#dbeafe] bg-white px-8 py-4 font-bold text-[#304866] transition hover:bg-[#f7fbff] hover:shadow-md"
              >
                Daftar Sebagai Kantin
              </Link>
            </div>

            {/* Financial Support Badge */}
            <div className="mt-14 border-t border-[#dbeafe]/80 pt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#58708e]">
                Didukung & Selaras Dengan
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {["Bank Indonesia", "OJK", "PIDI Digdaya"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 rounded-xl border border-[#dbeafe] bg-white px-4 py-2 text-xs font-bold text-[#304866] shadow-sm transition hover:border-[#1c77d2]/30"
                  >
                    <CheckCircle2 size={13} className="text-[#1f9d68]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: BEAUTIFUL APP PREVIEW & INTERACTIVE DECORATION */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative">

              {/* Decorative Circle Elements */}
              <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full border-4 border-dashed border-[#dbeafe]" />
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#e9e3ff] opacity-50 blur-2xl" />

              {/* Smartphone Frame UI */}
              <div className="w-[310px] sm:w-[330px] rounded-[48px] border-[12px] border-[#10233f] bg-white p-6 shadow-2xl transition hover:rotate-1">
                
                {/* Status Bar */}
                <div className="mb-4 flex items-center justify-between px-2 text-[11px] font-bold text-[#58708e]">
                  <span>08:00 AM</span>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-3 rounded-sm bg-[#10233f]" />
                    <span className="h-2 w-2 rounded-full bg-[#1f9d68]" />
                  </div>
                </div>

                {/* Header Profile */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#58708e]">Wali Siswa</p>
                    <h3 className="text-lg font-black text-[#10233f]">Bunda Risa</h3>
                  </div>
                  <div className="rounded-2xl bg-[#dbeafe] p-2.5 text-[#1c77d2]">
                    <WalletCards size={20} />
                  </div>
                </div>

                {/* Main Balanced Card */}
                <div className="mt-6 rounded-3xl bg-[#10233f] p-5 text-white relative overflow-hidden">
                  <div className="absolute right-[-20px] bottom-[-20px] h-20 w-20 rounded-full bg-white/5" />
                  <p className="text-xs text-white/70">Total Saldo Anak</p>
                  <h2 className="mt-1 text-3xl font-black text-[#ffd84d]">
                    Rp125.000
                  </h2>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[#1f9d68] bg-[#1f9d68]/15 px-2.5 py-1 rounded-full w-max">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1f9d68]" />
                    Terhubung 1 Kartu Aktif
                  </div>
                </div>

                {/* Info Grid (Limit & Transaksi) */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#f7fbff] border border-[#dbeafe] p-3">
                    <Clock className="text-[#1c77d2]" size={18} />
                    <p className="mt-2 text-[11px] text-[#58708e]">Limit Harian</p>
                    <h3 className="font-extrabold text-xs text-[#10233f]">Rp20.000</h3>
                  </div>
                  
                  <div className="rounded-2xl bg-[#f7fbff] border border-[#dbeafe] p-3">
                    <History className="text-[#1f9d68]" size={18} />
                    <p className="mt-2 text-[11px] text-[#58708e]">Transaksi</p>
                    <h3 className="font-extrabold text-xs text-[#10233f]">18x Bulan Ini</h3>
                  </div>
                </div>

                {/* Mini Quick Actions */}
                <div className="mt-4 border-t border-[#dbeafe]/60 pt-4">
                  <p className="text-[11px] font-bold text-[#58708e] mb-2">Aktivitas Terakhir</p>
                  <div className="flex items-center justify-between rounded-xl bg-[#f7fbff] p-2 text-xs">
                    <span className="font-bold text-[#10233f]">Kantin Bu Nining</span>
                    <span className="font-black text-[#1f9d68]">-Rp8.000</span>
                  </div>
                </div>

              </div>

              {/* FLOATING DECORATION: NFC CARD */}
              <div className="absolute -left-20 top-[30%] w-52 rotate-[-12deg] rounded-3xl bg-[#1c77d2] p-5 text-white shadow-xl border border-white/20 hover:scale-105 hover:rotate-[-6deg] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-white/80">KOIN STUDENT</span>
                  <CreditCard size={18} className="text-[#ffd84d]" />
                </div>
                <h2 className="mt-8 text-2xl font-black text-white">KOIN CARD</h2>
                <div className="mt-6 flex items-center justify-between text-xs">
                  <span className="rounded bg-white/25 px-2 py-0.5 text-[9px] font-bold">NFC TAP</span>
                  <Radio size={14} className="animate-ping" />
                </div>
              </div>

              {/* FLOATING DECORATION: TOP-UP STATUS */}
              <div className="absolute -right-12 top-[10%] rounded-2xl bg-white p-3.5 shadow-xl border border-[#dbeafe] flex items-center gap-3">
                <div className="rounded-full bg-[#1f9d68]/15 p-2 text-[#1f9d68]">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-[#58708e]">Auto Top Up</p>
                  <h4 className="text-xs font-black text-[#10233f]">Berhasil Aktif</h4>
                </div>
              </div>

              {/* FLOATING DECORATION: GOLDEN BANNER */}
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-[#ffd84d] p-3 shadow-lg border border-[#ffd84d] flex items-center gap-2">
                <Star size={16} className="text-[#10233f] fill-current" />
                <span className="text-xs font-bold text-[#10233f]">Premium Cashless</span>
              </div>

            </div>
          </div>

        </div>

      </section>

      {}
      {/* ================= STATS SECTION ================= */}
      <section className="relative z-20 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ title, value, icon: Icon, badge }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-[#dbeafe] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Decorative Lilac Blob */}
                <div className="absolute right-0 top-0 h-16 w-16 bg-[#e9e3ff] opacity-0 transition-opacity duration-300 group-hover:opacity-40 rounded-bl-full" />
                
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1c77d2]/15 text-[#1c77d2]">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-full bg-[#dbeafe]/50 px-2.5 py-0.5 text-[10px] font-bold text-[#1c77d2]">
                    {badge}
                  </span>
                </div>

                <h2 className="mt-6 text-3xl font-black text-[#10233f] group-hover:text-[#1c77d2] transition-colors">
                  {value}
                </h2>

                <p className="mt-1 text-sm text-[#58708e] font-medium">
                  {title}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {}
      {/* ================= HOW IT WORKS SECTION ================= */}
      <section id="ekosistem" className="bg-white py-24 border-y border-[#dbeafe]/80">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ffd84d]/20 px-4 py-1.5 text-xs font-bold text-[#10233f] uppercase tracking-wider">
              Cara Kerja KOIN
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#10233f] sm:text-5xl">
              Satu Ekosistem,
              <br />
              <span className="text-[#1c77d2]">Empat Peran Sinergis</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#58708e]">
              Semua elemen di sekolah saling terhubung demi menciptakan transaksi saku digital yang aman, menyenangkan, dan termonitor dengan baik.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Orang Tua",
                desc: "Kontrol penuh saldo, limitasi saku harian, serta monitor jenis jajanan anak secara real-time.",
                icon: Users,
                color: "bg-[#1c77d2]/10 text-[#1c77d2]",
              },
              {
                title: "Siswa (Anak)",
                desc: "Membayar jajanan di kantin sehat cukup dengan melakukan tap kartu NFC KOIN yang praktis.",
                icon: BookOpenCheck,
                color: "bg-[#e9e3ff]/80 text-[#8b5cf6]", // Lilac Highlight
              },
              {
                title: "Kantin Mitra",
                desc: "Menerima pembayaran instan nirkabel tanpa repot mengurus uang kembalian atau resiko kehilangan.",
                icon: Store,
                color: "bg-[#ffd84d]/25 text-[#10233f]", // Gold Highlight
              },
              {
                title: "Sekolah Admin",
                desc: "Memperoleh data dashboard kesehatan finansial kantin dan menaikkan gengsi sekolah modern.",
                icon: ShieldCheck,
                color: "bg-[#1f9d68]/15 text-[#1f9d68]", // Mint Highlight
              },
            ].map(({ title, desc, icon: Icon, color }, index) => (
              <div
                key={title}
                className="relative group rounded-3xl border border-[#dbeafe] bg-[#f7fbff] p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:bg-white"
              >
                
                {/* Visual Step Badge */}
                <div className="absolute top-4 right-4 text-4xl font-extrabold text-[#dbeafe]/60 group-hover:text-[#1c77d2]/20">
                  0{index + 1}
                </div>

                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${color}`}>
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-[#10233f]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#58708e]">
                  {desc}
                </p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {}
      {/* ================= TRANSACTION FLOW SECTION ================= */}
      <section className="py-24 bg-[#f7fbff]">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="rounded-[40px] bg-[#10233f] p-8 sm:p-14 text-white relative overflow-hidden">
            
            {/* Background glowing design */}
            <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-[#1c77d2]/40 blur-3xl" />
            <div className="absolute left-[-50px] bottom-[-50px] h-64 w-64 rounded-full bg-[#ffd84d]/10 blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl font-black sm:text-4xl text-[#ffd84d]">
                Alur Transaksi KOIN
              </h2>
              <p className="mt-2 max-w-2xl text-white/70 text-sm sm:text-base">
                Didesain sesederhana mungkin agar dapat dipahami anak sekolah dasar hingga lanjut tanpa mengurangi keamanan data keuangan.
              </p>

              <div className="mt-14 grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  { title: "Top Up Saldo", sub: "Via Mobile Banking / Dompet Digital" },
                  { title: "Set Limit Harian", sub: "Agar anak belajar berhemat" },
                  { title: "Siswa Tap Kartu", sub: "Pembayaran super cepat" },
                  { title: "Saldo Terpotong", sub: "Langsung diperbarui ke wali" },
                  { title: "Laporan Masuk", sub: "Rekap transaksi harian otomatis" },
                ].map((step, index) => (
                  <div key={step.title} className="relative text-center group">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffd84d] text-xl font-black text-[#10233f] shadow-md shadow-[#ffd84d]/10 transition-transform group-hover:scale-110">
                      {index + 1}
                    </div>
                    <h3 className="mt-5 text-sm font-extrabold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">
                      {step.sub}
                    </p>

                    {index < 4 && (
                      <div className="absolute left-1/2 top-7 -z-10 hidden h-[2px] w-full bg-white/10 lg:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {}
      {/* ================= WHY KOIN SECTION ================= */}
      <section id="fitur" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-12">

            {/* LEFT: Core Benfits */}
            <div className="lg:col-span-6">
              <div className="inline-flex rounded-full bg-[#1c77d2]/10 px-4 py-1.5 text-xs font-bold text-[#1c77d2] uppercase tracking-wider">
                Mengapa Harus KOIN?
              </div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#10233f] sm:text-5xl">
                Menjaga Jajanan Anak
                <br />
                <span className="text-[#1c77d2]">Tetap Terkontrol & Sehat</span>
              </h2>
              <p className="mt-6 text-[#58708e] leading-relaxed">
                Kami peduli dengan pertumbuhan finansial serta gizi anak di sekolah. Platform KOIN dibuat untuk memutus rantai jajan sembarangan sekaligus memonitor saku digital anak Anda.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  {
                    title: "Tanpa Uang Tunai (Cashless)",
                    desc: "Anak tidak takut kehilangan uang saku kertas lagi.",
                    icon: BadgeCheck,
                    badgeColor: "text-[#1c77d2]",
                  },
                  {
                    title: "Batas Belanja Anak",
                    desc: "Atur maksimum belanja harian agar tidak boros.",
                    icon: PiggyBank,
                    badgeColor: "text-[#8b5cf6]", // Lilac representation
                  },
                  {
                    title: "Laporan Riwayat Realtime",
                    desc: "Notifikasi masuk langsung saat kartu KOIN ditap.",
                    icon: TrendingUp,
                    badgeColor: "text-[#1f9d68]", // Mint
                  },
                ].map(({ title, desc, icon: Icon, badgeColor }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-[#dbeafe] bg-[#f7fbff] p-5 transition-all hover:bg-white hover:shadow-md"
                  >
                    <div className={`mt-0.5 rounded-xl bg-[#dbeafe]/40 p-2.5 ${badgeColor}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#10233f] text-sm sm:text-base">{title}</h4>
                      <p className="mt-1 text-xs sm:text-sm text-[#58708e]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Live Visual Cards Preview */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-[40px] bg-gradient-to-tr from-[#10233f] to-[#304866] p-8 text-white shadow-2xl relative overflow-hidden">
                
                {/* Ornaments */}
                <div className="absolute right-0 bottom-0 h-48 w-48 bg-[#1c77d2]/20 rounded-full blur-3xl" />
                
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-widest">Wali Monitor</span>
                    <h3 className="text-xl font-bold">Ringkasan Hari Ini</h3>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <WalletCards size={24} className="text-[#ffd84d]" />
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Sisa Saldo</span>
                      <span className="font-black text-[#ffd84d]">Rp105.000 / Rp125.000</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-[#1c77d2]" style={{ width: "84%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Limit Harian (Terpakai)</span>
                      <span className="font-black text-white">Rp20.000 / Rp20.000 (Habis)</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-[#1f9d68]" style={{ width: "100%" }} /> {/* Mint */}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Rencana Tabungan Anak</span>
                      <span className="font-black text-[#ffd84d]">Rp75.000</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-purple-400" style={{ width: "60%" }} /> {/* Lilac representation */}
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-white/5 p-4 flex items-center justify-between text-xs text-white/80">
                  <span>Proteksi Kartu Aktif</span>
                  <span className="flex items-center gap-1 text-[#1f9d68] font-bold">
                    <span className="h-2 w-2 rounded-full bg-[#1f9d68]" /> Safe Mode
                  </span>
                </div>

              </div>

              {/* Absolut Float Info */}
              <div className="absolute -left-8 -bottom-8 rounded-3xl bg-white p-5 shadow-xl border border-[#dbeafe] flex items-center gap-3">
                <div className="rounded-full bg-[#1f9d68]/15 p-3 text-[#1f9d68]">
                  <BadgeCheck size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-[#58708e]">Verifikasi Enkripsi</p>
                  <h4 className="font-black text-[#10233f] text-sm">100% Secure NFC</h4>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {}
      {/* ================= ROADMAP & PILOT SCHOOLS ================= */}
      <section id="pilot" className="py-24 bg-[#f7fbff]">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ffd84d]/20 px-4 py-1.5 text-xs font-bold text-[#10233f] uppercase tracking-wider">
              Roadmap Implementasi
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#10233f] sm:text-5xl">
              Langkah Digitalisasi Sekolah
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#58708e]">
              Berikut adalah jaringan sekolah pilot perdana dan rencana ekspansi jangkauan saku pintar digital KOIN di Indonesia.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {schools.map((school, index) => {
              const isPilot = school.status === "Pilot Aktif";
              return (
                <div
                  key={school.name}
                  className="relative flex flex-col justify-between rounded-3xl border border-[#dbeafe] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                          isPilot
                            ? "bg-[#1f9d68]/15 text-[#1f9d68]"
                            : "bg-[#1c77d2]/10 text-[#1c77d2]"
                        }`}
                      >
                        {school.status}
                      </span>
                      <span className="text-xs font-bold text-[#58708e]">0{index + 1}</span>
                    </div>

                    <h3 className="mt-4 text-lg font-black text-[#10233f]">
                      {school.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[#58708e]">
                      {school.desc}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#dbeafe]/80 pt-4 flex items-center gap-2 text-xs text-[#304866] font-bold">
                    <School size={14} className="text-[#1c77d2]" />
                    <span>Mitra Pendidikan</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {}
      {/* ================= CALL TO ACTION ================= */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="relative overflow-hidden rounded-[40px] bg-[#10233f] px-6 py-20 text-center text-white sm:px-12">
            
            {/* Background blur rings */}
            <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-[#1c77d2]/30 blur-[100px]" />
            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#ffd84d]/15 blur-[100px]" />

            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#ffd84d] uppercase tracking-wider">
                Gabung KOIN Sekarang
              </span>

              <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
                Saatnya Mewujudkan
                <br />
                <span className="text-[#ffd84d]">Sekolah Cashless Masa Kini</span>
              </h2>

              <p className="mt-6 text-sm text-white/70 sm:text-base leading-relaxed">
                Daftarkan wali murid maupun kantin sekolah Anda ke dalam sistem saku digital KOIN. Lebih bersih, terkontrol, dan memfasilitasi anak belajar menabung demi masa depan cerah.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register/parent"
                  className="rounded-2xl bg-[#ffd84d] px-8 py-4 font-black text-[#10233f] shadow-lg shadow-[#ffd84d]/20 transition-transform hover:scale-105"
                >
                  Registrasi Wali Murid
                </Link>

                <Link
                  href="/register/canteen"
                  className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-bold text-white transition hover:bg-white hover:text-[#10233f]"
                >
                  Registrasi Kantin Sekolah
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {}
      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#dbeafe] bg-[#f7fbff] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            
            <div>
              <KoinBrand />
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#58708e]">
                KOIN adalah ekosistem uang saku digital berbasis kartu pintar NFC untuk mendidik kebiasaan finansial anak sejak bangku sekolah secara aman, transparan, dan realtime.
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm font-black text-[#10233f]">
                Kenali • Olah • Ingat • Nabung
              </p>
              <p className="mt-2 text-xs text-[#58708e]">
                © 2026 KOIN. Hak Cipta Dilindungi Undang-Undang.
              </p>
              <p className="mt-1 text-[10px] text-[#58708e]/70">
                Built with ❤️ using Next.js, Tailwind CSS & Supabase
              </p>
            </div>

          </div>
        </div>
      </footer>

    </main>
  );
}
