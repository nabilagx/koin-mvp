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
    desc: "Sekolah pertama peneru rintisan ekosistem uang saku digital berbasis kartu pintar NFC.",
  },
  {
    name: "SMPN 1 Jember",
    status: "Segera Hadir",
    desc: "Tahap koordinasi awal & pemetaan sarana kantin sehat bebas uang tunai fisik.",
  },
  {
    name: "SD Al-Amin",
    status: "Segera Hadir",
    desc: "Sosialisasi awal sistem tabungan siswa yang terintegrasi penuh dengan dasbor wali murid.",
  },
  {
    name: "Kantin Sehat Mandiri",
    status: "Segera Hadir",
    desc: "Digitalisasi pembayaran stand jajanan sehat dalam satu genggaman kartu siswa.",
  },
];

const stats = [
  {
    title: "Sekolah Pilot",
    value: "1",
    icon: School,
    badge: "Aktif",
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
    <main className="min-h-screen bg-[#f8f7ff] text-[#10233f] overflow-hidden selection:bg-[#8b5cf6]/20">
      
      {/* ================= BAR NAVIGASI (LILAC GLASSMORPHISM) ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#ede9fe] bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <KoinBrand />

          <div className="hidden items-center gap-8 font-semibold text-[#58708e] lg:flex">
            <a
              href="#fitur"
              className="relative py-1 transition hover:text-[#7c3aed] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#7c3aed] after:transition-all"
            >
              Fitur Utama
            </a>

            <a
              href="#ekosistem"
              className="relative py-1 transition hover:text-[#7c3aed] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#7c3aed] after:transition-all"
            >
              Ekosistem KOIN
            </a>

            <a
              href="#pilot"
              className="relative py-1 transition hover:text-[#7c3aed] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#7c3aed] after:transition-all"
            >
              Mitra Sekolah
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-[#ede9fe] bg-white px-5 py-2.5 font-bold text-[#304866] transition hover:bg-[#f5f3ff] hover:shadow-sm"
            >
              Masuk
            </Link>

            <Link
              href="/register/parent"
              className="group relative overflow-hidden rounded-xl bg-[#7c3aed] px-6 py-2.5 font-bold text-white shadow-md shadow-[#7c3aed]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#7c3aed]/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Daftar Sekarang
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

        </div>
      </nav>

      {/* ================= HERO SECTION (TEMA LILAC & DASHBOARD MOCKUP) ================= */}
      <section className="relative overflow-hidden py-16 lg:py-24">

        {/* Dekorasi Blob Gradasi Lilac & Gold Lembut */}
        <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#ede9fe]/60 blur-[130px]" />
        <div className="absolute right-[-5%] top-[5%] h-[400px] w-[400px] rounded-full bg-[#fef3c7]/50 blur-[120px]" />
        <div className="absolute right-[35%] bottom-[-5%] h-[300px] w-[300px] rounded-full bg-[#e9e3ff]/70 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12">

          {/* SISI KIRI: PENJELASAN UTAMA & CTA */}
          <div className="lg:col-span-5">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#ede9fe] bg-white px-4 py-2 text-xs font-bold text-[#10233f] shadow-sm">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#1f9d68] animate-pulse" />
              <Sparkles size={14} className="text-[#ffd84d]" />
              Pilot Project • SMPN 2 Ambulu
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.15] text-[#10233f] sm:text-5xl lg:text-5xl xl:text-6xl">
              Uang Saku Digital
              <br />
              <span className="relative inline-block text-white my-1">
                <span className="absolute inset-0 -skew-y-1 bg-[#7c3aed] rounded-lg shadow-md shadow-[#7c3aed]/10" />
                <span className="relative px-3 py-1">Kartu NFC</span>
              </span>
              <span className="text-[#7c3aed]"> Lebih Sehat</span>
              <br />
              & Terkontrol.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#58708e] sm:text-lg">
              KOIN mendesain ekosistem keuangan sekolah modern berbasis kartu tap tanpa repot kembalian, sekaligus menanamkan kebiasaan mengolah uang cerdas sejak anak usia dini.
            </p>

            {/* Tombol Aksi Utama */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register/parent"
                className="flex items-center gap-2 rounded-2xl bg-[#7c3aed] px-8 py-4 font-extrabold text-white shadow-lg shadow-[#7c3aed]/25 transition hover:scale-105 hover:bg-[#6d28d9] hover:shadow-xl"
              >
                Mulai Sebagai Wali
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/register/canteen"
                className="rounded-2xl border border-[#ede9fe] bg-white px-8 py-4 font-bold text-[#304866] transition hover:bg-[#f5f3ff] hover:shadow-md"
              >
                Daftar Sebagai Kantin
              </Link>
            </div>

            {/* Aliansi Pendukung Finansial */}
            <div className="mt-14 border-t border-[#ede9fe] pt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#58708e]">
                Didukung & Selaras Dengan Regulasi
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {["Bank Indonesia", "OJK", "PIDI Digdaya"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 rounded-xl border border-[#ede9fe] bg-white px-4 py-2 text-xs font-bold text-[#304866] shadow-sm transition hover:border-[#7c3aed]/30"
                  >
                    <CheckCircle2 size={13} className="text-[#1f9d68]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SISI KANAN: PREVIEW DASHBOARD ADMIN ASLI (DARI BERKAS image_c431d8.png) */}
          <div className="lg:col-span-7 relative flex justify-center">
            
            {/* Ornamen Grafis Lingkaran Belakang */}
            <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full border-4 border-dashed border-[#ede9fe]" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#ede9fe] opacity-50 blur-2xl" />

            {/* CONTAINER UTAMA DASHBOARD MOCKUP */}
            <div className="w-full max-w-[640px] rounded-3xl border border-[#ede9fe] bg-[#f5f3ff] p-4 shadow-[0_20px_50px_rgba(233,227,255,0.8)] overflow-hidden hover:rotate-1 transition-transform duration-500">
              
              {/* Header Bar Mockup */}
              <div className="flex items-center justify-between border-b border-[#ede9fe] pb-3 mb-3 px-1">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                </div>
                <span className="text-[10px] font-bold text-[#58708e]/70 tracking-widest uppercase">Admin KOIN Console v1.0</span>
              </div>

              {/* Grid Layout Dalam Mockup (Meniru image_c431d8.png) */}
              <div className="grid grid-cols-12 gap-3">
                
                {/* 1. Mini Sidebar (Sisi Kiri Mockup) */}
                <div className="col-span-3 bg-white rounded-2xl p-3 border border-[#ede9fe] flex flex-col justify-between min-h-[360px]">
                  <div>
                    {/* Logo K KOIN */}
                    <div className="flex items-center gap-1.5 mb-5">
                      <div className="w-6 h-6 rounded-full bg-[#ffd84d] flex items-center justify-center font-black text-[#10233f] text-xs">K</div>
                      <span className="text-[11px] font-black tracking-wide text-[#10233f]">KOIN</span>
                    </div>

                    {/* Menu List */}
                    <div className="space-y-1">
                      {/* Menu Ringkasan Terpilih (Gold background #fef3c7 sesuai image_c431d8.png) */}
                      <div className="bg-[#fef3c7] text-[#10233f] text-[9px] font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
                        <span className="w-1 h-2 bg-[#ffd84d] rounded-full" />
                        Ringkasan
                      </div>
                      <div className="text-[#58708e] text-[9px] font-bold px-2.5 py-1.5 hover:bg-[#ede9fe]/30 rounded-lg cursor-pointer">Pengguna</div>
                      <div className="text-[#58708e] text-[9px] font-bold px-2.5 py-1.5 hover:bg-[#ede9fe]/30 rounded-lg cursor-pointer">Orang Tua</div>
                      <div className="text-[#58708e] text-[9px] font-bold px-2.5 py-1.5 hover:bg-[#ede9fe]/30 rounded-lg cursor-pointer">Anak</div>
                      <div className="text-[#58708e] text-[9px] font-bold px-2.5 py-1.5 hover:bg-[#ede9fe]/30 rounded-lg cursor-pointer">Kantin</div>
                      <div className="text-[#58708e] text-[9px] font-bold px-2.5 py-1.5 hover:bg-[#ede9fe]/30 rounded-lg cursor-pointer">Kartu</div>
                    </div>
                  </div>

                  {/* Demo Card di Bawah Sidebar */}
                  <div className="bg-[#10233f] p-2 rounded-xl text-[8px] text-white">
                    <p className="font-bold text-[#ffd84d] flex items-center gap-1"><Star size={8} /> Demo KOIN</p>
                    <p className="text-[7px] text-white/75 mt-1">Smart school wallet.</p>
                  </div>
                </div>

                {/* 2. Main Content Dashboard (Sisi Kanan Mockup) */}
                <div className="col-span-9 space-y-3">
                  
                  {/* Dashboard Header Bar */}
                  <div className="bg-white rounded-2xl p-3 border border-[#ede9fe] flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black uppercase text-[#7c3aed]">DASHBOARD KOIN</p>
                      <h4 className="text-sm font-black text-[#10233f]">Dashboard Admin</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#f5f3ff] border border-[#ede9fe] flex items-center justify-center text-[#7c3aed]">
                        <Clock size={10} />
                      </div>
                      <span className="text-[9px] font-bold text-[#10233f]">Admin KOIN</span>
                    </div>
                  </div>

                  {/* Grid Stat Cards (Mengambil data dari image_c431d8.png) */}
                  <div className="grid grid-cols-2 gap-2">
                    
                    {[
                      { label: "PENGGUNA", count: "26" },
                      { label: "ORANG TUA", count: "8" },
                      { label: "ANAK", count: "12" },
                      { label: "KANTIN", count: "3" },
                      { label: "KARTU", count: "10" },
                      { label: "TRANSAKSI", count: "49" },
                    ].map((card) => (
                      <div key={card.label} className="bg-white rounded-2xl p-3 border border-[#ede9fe] shadow-[0_4px_12px_rgba(233,227,255,0.4)] hover:shadow-md transition-shadow">
                        <p className="text-[8px] font-bold text-[#58708e]/80 tracking-wider">{card.label}</p>
                        <p className="text-xl font-black text-[#10233f] mt-1">{card.count}</p>
                      </div>
                    ))}

                  </div>

                </div>

              </div>

            </div>

            {/* FLOATING DECORASI KARTU NFC KOIN */}
            <div className="absolute -left-10 bottom-4 w-48 rotate-[-12deg] rounded-2xl bg-[#7c3aed] p-4 text-white shadow-xl border border-white/20 hover:scale-105 hover:rotate-[-6deg] transition-all duration-300 hidden sm:block">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold tracking-widest text-white/80">KARTU SISWA NFC</span>
                <CreditCard size={14} className="text-[#ffd84d]" />
              </div>
              <h4 className="mt-6 text-lg font-black text-white">KOIN CARD</h4>
              <div className="mt-4 flex items-center justify-between text-[9px]">
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[8px] font-bold">NFC TAP</span>
                <Radio size={12} className="animate-ping" />
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ================= STATISTIK UTAMA (DENGAN TEMA WARNA LILAC & MINT) ================= */}
      <section className="relative z-20 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ title, value, icon: Icon, badge }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-[#ede9fe] bg-white p-7 shadow-[0_8px_30px_rgb(233,227,255,0.3)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#ede9fe]/80"
              >
                {/* Visual Aksen Gradient Lilac Cantik */}
                <div className="absolute right-0 top-0 h-16 w-16 bg-[#ede9fe] opacity-0 transition-opacity duration-300 group-hover:opacity-40 rounded-bl-full" />
                
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed]">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[10px] font-extrabold text-[#7c3aed]">
                    {badge}
                  </span>
                </div>

                <h2 className="mt-6 text-3xl font-black text-[#10233f] group-hover:text-[#7c3aed] transition-colors">
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

      {/* ================= CARA KERJA (EKOSISTEM PERAN SINERGIS) ================= */}
      <section id="ekosistem" className="bg-white py-24 border-y border-[#ede9fe]">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#fef3c7] px-4 py-1.5 text-xs font-bold text-[#10233f] uppercase tracking-wider">
              Cara Kerja KOIN
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#10233f] sm:text-5xl">
              Satu Ekosistem,
              <br />
              <span className="text-[#7c3aed]">Empat Peran Sinergis</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#58708e]">
              Semua elemen sekolah saling terhubung agar menciptakan proses transaksi saku digital yang aman, menyenangkan, serta termonitor dengan baik.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Orang Tua",
                desc: "Kontrol penuh atas limitasi saku harian anak, top-up saldo instan, serta memantau jajanan anak secara realtime.",
                icon: Users,
                color: "bg-[#7c3aed]/10 text-[#7c3aed]",
              },
              {
                title: "Siswa (Anak)",
                desc: "Membeli jajanan di stand kantin sekolah dengan praktis dan cepat, cukup menempelkan kartu NFC KOIN.",
                icon: BookOpenCheck,
                color: "bg-[#f3e8ff] text-[#7c3aed]", // Lilac Highlight
              },
              {
                title: "Kantin Mitra",
                desc: "Menerima pembayaran nontunai tanpa perlu menyiapkan kembalian receh dan meminimalisir risiko selisih.",
                icon: Store,
                color: "bg-[#fef3c7] text-[#10233f]", // Gold Highlight
              },
              {
                title: "Admin Sekolah",
                desc: "Memperoleh data dashboard kesehatan finansial kantin secara transparan guna menaikkan prestise sekolah.",
                icon: ShieldCheck,
                color: "bg-[#1f9d68]/15 text-[#1f9d68]", // Mint Highlight
              },
            ].map(({ title, desc, icon: Icon, color }, index) => (
              <div
                key={title}
                className="relative group rounded-3xl border border-[#ede9fe] bg-[#f8f7ff] p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:bg-white hover:border-[#ede9fe]/50"
              >
                
                {/* Visual Langkah Step Angka */}
                <div className="absolute top-4 right-4 text-4xl font-extrabold text-[#ede9fe] group-hover:text-[#7c3aed]/20">
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

      {/* ================= ALUR TRANSAKSI KOIN ================= */}
      <section className="py-24 bg-[#f8f7ff]">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="rounded-[40px] bg-[#10233f] p-8 sm:p-14 text-white relative overflow-hidden">
            
            {/* Background Ornamen Gradasi Menyala */}
            <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-[#7c3aed]/40 blur-3xl" />
            <div className="absolute left-[-50px] bottom-[-50px] h-64 w-64 rounded-full bg-[#ffd84d]/10 blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl font-black sm:text-4xl text-[#ffd84d]">
                Alur Transaksi KOIN
              </h2>
              <p className="mt-2 max-w-2xl text-white/70 text-sm sm:text-base">
                Didesain sesederhana mungkin agar dapat digunakan oleh anak-anak sekolah dasar tanpa mengurangi aspek keamanan finansial.
              </p>

              <div className="mt-14 grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  { title: "Top Up Saldo", sub: "Via Mobile Banking atau Dompet Digital" },
                  { title: "Set Limit Harian", sub: "Membantu anak belajar hemat" },
                  { title: "Siswa Tap Kartu", sub: "Pembayaran dalam hitungan detik" },
                  { title: "Saldo Terpotong", sub: "Realtime update ke ponsel wali murid" },
                  { title: "Laporan Otomatis", sub: "Semua pengeluaran tercatat di sistem" },
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

      {/* ================= KENAPA MEMILIH KOIN (VISUAL ELEGAN LILAC/MINT) ================= */}
      <section id="fitur" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-12">

            {/* SISI KIRI: MANFAAT INTI */}
            <div className="lg:col-span-6">
              <div className="inline-flex rounded-full bg-[#7c3aed]/10 px-4 py-1.5 text-xs font-bold text-[#7c3aed] uppercase tracking-wider">
                Mengapa Harus KOIN?
              </div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#10233f] sm:text-5xl">
                Menjaga Jajanan Anak
                <br />
                <span className="text-[#7c3aed]">Tetap Sehat & Terkendali</span>
              </h2>
              <p className="mt-6 text-[#58708e] leading-relaxed">
                Platform KOIN hadir untuk memutus kekhawatiran orang tua terkait uang hilang ataupun jajan sembarangan. Kita ciptakan ekosistem sekolah sehat yang cerdas finansial!
              </p>

              <div className="mt-10 space-y-4">
                {[
                  {
                    title: "Bebas Khawatir Uang Hilang",
                    desc: "Anak tidak perlu membawa uang fisik lembaran yang rawan tercecer.",
                    icon: BadgeCheck,
                    badgeColor: "text-[#7c3aed]",
                  },
                  {
                    title: "Batas Belanja Terstruktur",
                    desc: "Batasi pengeluaran per hari agar melatih jiwa mandiri berhemat anak.",
                    icon: PiggyBank,
                    badgeColor: "text-[#7c3aed]",
                  },
                  {
                    title: "Riwayat Pembelian Realtime",
                    desc: "Mengetahui secara detail kantin dan menu apa saja yang dibeli anak.",
                    icon: TrendingUp,
                    badgeColor: "text-[#1f9d68]",
                  },
                ].map(({ title, desc, icon: Icon, badgeColor }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-[#ede9fe] bg-[#f8f7ff] p-5 transition-all hover:bg-white hover:shadow-md"
                  >
                    <div className={`mt-0.5 rounded-xl bg-[#ede9fe] p-2.5 ${badgeColor}`}>
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

            {/* SISI KANAN: PREVIEW MONITORING SAKU WALI MURID */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-[40px] bg-gradient-to-tr from-[#10233f] to-[#304866] p-8 text-white shadow-2xl relative overflow-hidden">
                
                {/* Ornamen Kilau */}
                <div className="absolute right-0 bottom-0 h-48 w-48 bg-[#7c3aed]/20 rounded-full blur-3xl" />
                
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-widest">WALI MURID MONITOR</span>
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
                      <div className="h-2 rounded-full bg-[#7c3aed]" style={{ width: "84%" }} />
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
                      <div className="h-2 rounded-full bg-purple-400" style={{ width: "60%" }} /> {/* Lilac */}
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

              {/* Floating Badge Keamanan */}
              <div className="absolute -left-8 -bottom-8 rounded-3xl bg-white p-5 shadow-xl border border-[#ede9fe] flex items-center gap-3">
                <div className="rounded-full bg-[#1f9d68]/15 p-3 text-[#1f9d68]">
                  <BadgeCheck size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-[#58708e]">Verifikasi Keamanan</p>
                  <h4 className="font-black text-[#10233f] text-sm">100% Secure NFC</h4>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= MITRA SEKOLAH & ROADMAP ================= */}
      <section id="pilot" className="py-24 bg-[#f8f7ff]">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#fef3c7] px-4 py-1.5 text-xs font-bold text-[#10233f] uppercase tracking-wider">
              Roadmap Implementasi
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#10233f] sm:text-5xl">
              Langkah Digitalisasi Sekolah
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#58708e]">
              Berikut adalah jaringan sekolah rintisan awal dan rencana perluasan ekosistem KOIN demi masa depan anak cerdas finansial.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {schools.map((school, index) => {
              const isPilot = school.status === "Pilot Aktif";
              return (
                <div
                  key={school.name}
                  className="relative flex flex-col justify-between rounded-3xl border border-[#ede9fe] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                          isPilot
                            ? "bg-[#1f9d68]/15 text-[#1f9d68]"
                            : "bg-[#7c3aed]/10 text-[#7c3aed]"
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

                  <div className="mt-6 border-t border-[#ede9fe] pt-4 flex items-center gap-2 text-xs text-[#304866] font-bold">
                    <School size={14} className="text-[#7c3aed]" />
                    <span>Mitra Pendidikan</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= SEKSI AJAKAN AKHIR (CTA) ================= */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="relative overflow-hidden rounded-[40px] bg-[#10233f] px-6 py-20 text-center text-white sm:px-12">
            
            {/* Background Blur Ring */}
            <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-[#7c3aed]/30 blur-[100px]" />
            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#ffd84d]/15 blur-[100px]" />

            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#ffd84d] uppercase tracking-wider">
                Ayo Gabung KOIN Sekarang
              </span>

              <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
                Wujudkan Sekolah Modern
                <br />
                <span className="text-[#ffd84d]">Bebas Transaksi Fisik</span>
              </h2>

              <p className="mt-6 text-sm text-white/70 sm:text-base leading-relaxed">
                Mulai hubungkan kantin dan anak-anak Anda ke dalam program uji coba digitalisasi saku cerdas KOIN. Lebih bersih, terkontrol, dan menyenangkan untuk belajar menabung sejak dini.
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

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#ede9fe] bg-[#f8f7ff] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            
            <div>
              <KoinBrand />
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#58708e]">
                KOIN adalah sistem saku digital berbasis NFC inovatif untuk mendidik kebiasaan finansial anak sejak bangku sekolah secara aman, transparan, dan dapat dipantau realtime.
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm font-black text-[#10233f]">
                Kenali • Olah • Ingat • Nabung
              </p>
              <p className="mt-2 text-xs text-[#58708e]">
                © 2026 KOIN. Seluruh Hak Cipta Dilindungi.
              </p>
              <p className="mt-1 text-[10px] text-[#58708e]/70">
                Dibuat dengan ❤️ untuk Masa Depan Pendidikan Indonesia
              </p>
            </div>

          </div>
        </div>
      </footer>

    </main>
  );
}
