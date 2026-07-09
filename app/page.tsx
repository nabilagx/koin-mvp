import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Clock,
  CreditCard,
  Radio,
  School,
  ShieldCheck,
  Store,
  Users,
  WalletCards,
  Sparkles,
  TrendingUp,
  Star,
  History,
} from "lucide-react";

import { KoinBrand } from "@/components/KoinBrand";

const schools = [
  {
    name: "SMPN 2 Ambulu",
    status: "Pilot Aktif",
  },
  {
    name: "Sekolah Mitra Berikutnya",
    status: "Segera Hadir",
  },
  {
    name: "Komunitas Belajar",
    status: "Segera Hadir",
  },
  {
    name: "Kantin Sekolah Mitra",
    status: "Segera Hadir",
  },
];

const stats = [
  {
    title: "Sekolah Pilot",
    value: "1",
    icon: School,
  },
  {
    title: "Role Pengguna",
    value: "4",
    icon: Users,
  },
  {
    title: "Cashless",
    value: "100%",
    icon: WalletCards,
  },
  {
    title: "NFC Ready",
    value: "24/7",
    icon: Radio,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#faf9ff] text-[#10233f] overflow-hidden selection:bg-[#ede9fe]">
      
      {/* ================= STICKY NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#ede9fe] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <KoinBrand />

          <div className="hidden items-center gap-8 font-semibold text-[#58708e] lg:flex">
            <a
              href="#fitur"
              className="transition hover:text-[#7c3aed]"
            >
              Fitur
            </a>
            <a
              href="#ekosistem"
              className="transition hover:text-[#7c3aed]"
            >
              Ekosistem
            </a>
            <a
              href="#pilot"
              className="transition hover:text-[#7c3aed]"
            >
              Pilot
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-[#ede9fe] bg-white px-5 py-3 font-semibold text-[#10233f] transition hover:shadow-md hover:bg-[#f5f3ff]"
            >
              Masuk
            </Link>
            <Link
              href="/register/parent"
              className="rounded-xl bg-[#7c3aed] px-6 py-3 font-bold text-white transition hover:scale-105 hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-purple-100"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION WITH LILAC THEME ================= */}
      <section className="relative overflow-hidden pt-12 pb-24">
        {/* Background Blur Lilac & Gold (inspired by image_c431d8.png) */}
        <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-[#ede9fe]/55 blur-3xl" />
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-[#fef3c7]/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          
          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ffd84d]/25 px-4 py-2 text-sm font-bold text-[#10233f] border border-[#ffd84d]/40">
              <Sparkles size={16} className="text-[#7c3aed]" />
              Pilot Project • SMPN 2 Ambulu
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight lg:text-7xl text-[#10233f]">
              Digital Pocket
              <br />
              Money
              <span className="text-[#7c3aed] drop-shadow-sm">
                {" "}
                for Smart
              </span>
              <br />
              Schools.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#58708e]">
              KOIN membantu sekolah membangun ekosistem uang saku digital
              berbasis kartu NFC agar transaksi menjadi lebih aman,
              transparan, dan mendidik kebiasaan finansial sejak dini dengan visualisasi yang ceria.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register/parent"
                className="flex items-center gap-2 rounded-2xl bg-[#7c3aed] px-7 py-4 font-bold text-white transition hover:scale-105 hover:bg-[#6d28d9] hover:shadow-xl hover:shadow-purple-200"
              >
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/register/canteen"
                className="rounded-2xl border border-[#ede9fe] bg-white px-7 py-4 font-bold text-[#10233f] transition hover:bg-[#f5f3ff] hover:shadow-lg"
              >
                Daftar Kantin
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              {[
                "Bank Indonesia",
                "OJK",
                "PIDI Digdaya",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-[#ede9fe] bg-white px-5 py-3 text-sm font-bold text-[#10233f] shadow-sm hover:border-[#7c3aed]/30 transition"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT - THE ORIGINAL BEAUTIFUL PHONE MOCKUP (Reverted & Enhanced with Lilac) */}
          <div className="relative flex justify-center lg:justify-end pr-4">
            <div className="relative">
              
              {/* Premium Phone Container */}
              <div className="w-[340px] rounded-[40px] border-[10px] border-[#10233f] bg-white p-6 shadow-2xl shadow-purple-200/50 relative z-10">
                
                {/* Header HP */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#58708e]">
                      Selamat Datang
                    </p>
                    <h3 className="text-xl font-black text-[#10233f]">
                      Orang Tua
                    </h3>
                  </div>
                  <div className="rounded-full bg-[#ede9fe] p-3">
                    <WalletCards
                      className="text-[#7c3aed]"
                      size={24}
                    />
                  </div>
                </div>

                {/* Saldo Section */}
                <div className="mt-8 rounded-3xl bg-[#10233f] p-6 text-white shadow-lg shadow-indigo-950/20">
                  <p className="text-xs text-white/70">
                    Saldo Anak
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-[#ffd84d]">
                    Rp125.000
                  </h2>
                </div>

                {/* Grid Status (Limit & Transaksi/History) */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {/* Limit Hari Ini */}
                  <div className="rounded-2xl bg-[#faf9ff] border border-[#ede9fe] p-4">
                    <Clock
                      className="text-[#7c3aed]"
                      size={24}
                    />
                    <p className="mt-4 text-xs text-[#58708e]">
                      Limit Hari Ini
                    </p>
                    <h3 className="font-black text-[#10233f] text-sm mt-1">
                      Rp20.000
                    </h3>
                  </div>

                  {/* Transaksi History (This uses the 'History' icon!) */}
                  <div className="rounded-2xl bg-[#faf9ff] border border-[#ede9fe] p-4">
                    <History
                      className="text-[#1f9d68]"
                      size={24}
                    />
                    <p className="mt-4 text-xs text-[#58708e]">
                      Transaksi
                    </p>
                    <h3 className="font-black text-[#10233f] text-sm mt-1">
                      18x Berhasil
                    </h3>
                  </div>
                </div>

              </div>

              {/* Tilted KOIN NFC CARD (Lilac & Gold accents) */}
              <div className="absolute -left-20 top-24 w-56 rotate-[-12deg] rounded-3xl bg-[#7c3aed] p-6 text-white shadow-2xl shadow-purple-500/30 z-20 transition hover:rotate-0 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-[#ffd84d]">
                    KOIN CARD
                  </span>
                  <CreditCard size={22} className="text-[#ffd84d]" />
                </div>
                <h2 className="mt-12 text-3xl font-black">
                  KOIN
                </h2>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-xs text-purple-200">
                    NFC Pay
                  </span>
                  <Radio size={18} className="text-purple-200" />
                </div>
              </div>

              {/* FLOATING SUCCESS BADGE */}
              <div className="absolute -right-10 top-8 rounded-2xl bg-white border border-[#ede9fe] p-4 shadow-xl z-20 flex items-center gap-3">
                <div className="rounded-full bg-emerald-50 p-2">
                  <TrendingUp
                    className="text-[#1f9d68]"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-[#58708e]">
                    Top Up
                  </p>
                  <h4 className="font-black text-sm text-[#10233f]">
                    Berhasil!
                  </h4>
                </div>
              </div>

              {/* FLOATING SCHOOL READY BADGE */}
              <div className="absolute -bottom-5 right-4 rounded-2xl bg-[#ffd84d] p-4 shadow-xl z-20 flex items-center gap-3 border border-[#fef3c7]">
                <div className="rounded-full bg-white/40 p-2">
                  <Star size={20} className="text-[#10233f]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#10233f]/70">
                    Cashless
                  </p>
                  <h4 className="font-black text-sm text-[#10233f]">
                    School Ready
                  </h4>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="-mt-8 relative z-20 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ title, value, icon: Icon }) => (
              <div
                key={title}
                className="group rounded-3xl border border-[#ede9fe] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-100/50"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#ede9fe]/60">
                    <Icon
                      className="text-[#7c3aed]"
                      size={28}
                    />
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-[#7c3aed] opacity-0 transition group-hover:opacity-100"
                  />
                </div>
                <h2 className="mt-8 text-4xl font-black text-[#10233f]">
                  {value}
                </h2>
                <p className="mt-2 text-[#58708e]">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (EKOSISTEM) ================= */}
      <section
        id="ekosistem"
        className="bg-white py-24 border-y border-[#ede9fe]"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ede9fe] px-5 py-2 text-sm font-bold text-[#7c3aed]">
              Cara Kerja KOIN
            </div>
            <h2 className="mt-6 text-5xl font-black text-[#10233f]">
              Satu Ekosistem
              <br />
              Empat Peran
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#58708e]">
              Semua pengguna saling terhubung dalam satu alur transaksi
              yang sederhana, aman, dan transparan.
            </p>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-4">
            {[
              {
                title: "Orang Tua",
                desc: "Top up saldo anak, atur limit jajan harian, kelola tabungan masa depan.",
                icon: Users,
              },
              {
                title: "Anak",
                desc: "Membeli jajanan sehat di kantin menggunakan kartu NFC berdesain kece.",
                icon: BookOpenCheck,
              },
              {
                title: "Kantin",
                desc: "Menerima pembayaran instan tanpa repot mencari uang kembalian.",
                icon: Store,
              },
              {
                title: "Admin",
                desc: "Melakukan monitoring laporan keuangan sekolah lewat dashboard lilac super canggih.",
                icon: ShieldCheck,
              },
            ].map(({ title, desc, icon: Icon }, index) => (
              <div
                key={title}
                className="relative"
              >
                <div className="rounded-[32px] border border-[#ede9fe] bg-[#faf9ff] p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-100/55">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#ede9fe]">
                    <Icon
                      className="text-[#7c3aed]"
                      size={30}
                    />
                  </div>
                  <h3 className="mt-8 text-2xl font-black text-[#10233f]">
                    {title}
                  </h3>
                  <p className="mt-4 leading-7 text-[#58708e]">
                    {desc}
                  </p>
                </div>

                {index < 3 && (
                  <div className="absolute right-[-28px] top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight
                      className="text-[#7c3aed]/40"
                      size={28}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALUR TRANSAKSI SECTION ================= */}
      <section className="py-24 bg-[#faf9ff]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[36px] bg-[#10233f] p-10 text-white shadow-xl">
            <h2 className="text-4xl font-black">
              Alur Transaksi KOIN
            </h2>
            <p className="mt-4 max-w-2xl text-purple-200/80">
              Dari orang tua hingga laporan sekolah, semua transaksi tercatat secara otomatis dan real-time.
            </p>

            <div className="mt-14 grid gap-6 lg:grid-cols-5">
              {[
                "Top Up Orang Tua",
                "Saldo Masuk",
                "Tap NFC Kartu",
                "Pembayaran Kantin",
                "Laporan Riwayat",
              ].map((step, index) => (
                <div
                  key={step}
                  className="relative text-center"
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#ffd84d] text-2xl font-black text-[#10233f] shadow-lg shadow-amber-500/20">
                    {index + 1}
                  </div>
                  <h3 className="mt-6 font-bold text-white text-base">
                    {step}
                  </h3>
                  {index < 4 && (
                    <div className="absolute left-full top-8 hidden h-[2px] w-full bg-white/20 lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY KOIN ================= */}
      <section className="py-24 bg-white border-b border-[#ede9fe]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            
            {/* LEFT */}
            <div>
              <div className="inline-flex rounded-full bg-[#ede9fe] px-5 py-2 text-sm font-bold text-[#7c3aed]">
                Mengapa Memilih KOIN?
              </div>
              <h2 className="mt-6 text-5xl font-black leading-tight text-[#10233f]">
                Satu Platform,
                <br />
                Banyak Manfaat.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#58708e]">
                KOIN dirancang agar orang tua, siswa, kantin, dan sekolah dapat menggunakan satu sistem yang sederhana namun tetap aman, transparan, dan mudah digunakan setiap hari.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  [
                    "Aman & Transparan",
                    "Semua transaksi tercatat secara real-time demi kenyamanan bersama."
                  ],
                  [
                    "Cashless NFC",
                    "Siswa tidak perlu membawa uang fisik, meminimalisir risiko kehilangan."
                  ],
                  [
                    "Kontrol Orang Tua",
                    "Atur limit jajan harian langsung dari gadget Anda."
                  ],
                  [
                    "Belajar Menabung",
                    "Membentuk kebiasaan finansial yang bijak sejak usia dini."
                  ],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="flex gap-5 rounded-3xl border border-[#ede9fe] bg-[#faf9ff] p-6 transition hover:shadow-lg"
                  >
                    <div className="mt-1 grid h-12 w-12 place-items-center rounded-xl bg-[#ede9fe]">
                      <BadgeCheck
                        className="text-[#7c3aed]"
                        size={22}
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-[#10233f]">
                        {title}
                      </h3>
                      <p className="mt-2 leading-7 text-[#58708e] text-sm">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - STATISTICS PREVIEW */}
            <div className="relative">
              <div className="rounded-[40px] bg-white border border-[#ede9fe] p-8 shadow-2xl shadow-purple-100/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#58708e]">
                      Dashboard Monitor
                    </p>
                    <h3 className="text-2xl font-black text-[#10233f]">
                      Ringkasan Hari Ini
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-[#ede9fe] p-4">
                    <WalletCards
                      className="text-[#7c3aed]"
                      size={26}
                    />
                  </div>
                </div>

                <div className="mt-10 space-y-6">
                  <div>
                    <div className="flex justify-between text-[#10233f] font-semibold text-sm">
                      <span>Total Saldo Siswa</span>
                      <span className="font-black">
                        Rp125.000
                      </span>
                    </div>
                    <div className="mt-3 h-3 rounded-full bg-[#ede9fe]">
                      <div className="h-3 w-[82%] rounded-full bg-[#7c3aed]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#10233f] font-semibold text-sm">
                      <span>Limit Sisa Harian</span>
                      <span className="font-black">
                        Rp20.000
                      </span>
                    </div>
                    <div className="mt-3 h-3 rounded-full bg-[#ede9fe]">
                      <div className="h-3 w-[35%] rounded-full bg-[#ffd84d]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#10233f] font-semibold text-sm">
                      <span>Saku Tabungan</span>
                      <span className="font-black">
                        Rp75.000
                      </span>
                    </div>
                    <div className="mt-3 h-3 rounded-full bg-[#ede9fe]">
                      <div className="h-3 w-[65%] rounded-full bg-[#1f9d68]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING CHIPS */}
              <div className="absolute -left-8 top-12 rounded-3xl bg-[#10233f] p-5 text-white shadow-xl">
                <p className="text-[10px] text-purple-200">
                  Transaksi Hari Ini
                </p>
                <h3 className="mt-2 text-3xl font-black text-[#ffd84d]">
                  18
                </h3>
              </div>

              <div className="absolute -right-6 bottom-8 rounded-3xl bg-[#ffd84d] p-5 shadow-xl border border-[#fef3c7]">
                <p className="text-[10px] text-[#10233f]/70 font-bold">
                  Cashless
                </p>
                <h3 className="mt-2 font-black text-[#10233f] text-sm">
                  NFC Active
                </h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PILOT SCHOOL ROADMAP ================= */}
      <section
        id="pilot"
        className="py-24 bg-[#faf9ff]"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ede9fe] px-5 py-2 text-sm font-bold text-[#7c3aed]">
              Roadmap Implementasi
            </div>
            <h2 className="mt-6 text-5xl font-black text-[#10233f]">
              Perjalanan KOIN
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#58708e]">
              Dimulai dari satu sekolah pilot, kemudian berkembang menjadi ekosistem pembayaran digital sekolah yang lebih luas secara berkelanjutan.
            </p>
          </div>

          <div className="mt-20 relative">
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 top-8 hidden h-1 bg-[#ede9fe] lg:block" />

            <div className="grid gap-8 lg:grid-cols-4">
              {schools.map((school, index) => (
                <div
                  key={school.name}
                  className="relative text-center"
                >
                  {/* Timeline Node */}
                  <div
                    className={`mx-auto grid h-16 w-16 place-items-center rounded-full shadow-lg transition duration-300 ${
                      school.status === "Pilot Aktif"
                        ? "bg-[#7c3aed] text-white shadow-purple-200"
                        : "bg-white border-4 border-[#ede9fe] text-[#58708e]"
                    }`}
                  >
                    <School size={28} />
                  </div>

                  <div className="mt-8 rounded-[30px] border border-[#ede9fe] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-100/30">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${
                        school.status === "Pilot Aktif"
                          ? "bg-[#ffd84d]/35 text-[#10233f]"
                          : "bg-[#ede9fe] text-[#7c3aed]"
                      }`}
                    >
                      {school.status}
                    </span>
                    <h3 className="mt-5 text-xl font-black text-[#10233f]">
                      {school.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#58708e]">
                      {index === 0
                        ? "Sekolah pertama yang menjadi lokasi implementasi dan pengujian MVP KOIN."
                        : "Tahapan ekspansi menuju ekosistem sekolah digital berikutnya."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION (CTA) ================= */}
      <section className="pb-24 bg-[#faf9ff]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[40px] bg-[#10233f] px-10 py-20 text-center text-white shadow-2xl shadow-indigo-950/20">
            {/* Background Blurs */}
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#7c3aed]/30 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#ffd84d]/20 blur-3xl" />

            <div className="relative">
              <div className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-purple-200">
                Bergabung Bersama KOIN
              </div>
              <h2 className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-tight text-white">
                Bangun Ekosistem
                <br />
                Uang Saku Digital
                <br />
                untuk Sekolah Indonesia.
              </h2>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-purple-200/80">
                Mulai perjalanan digitalisasi sekolah bersama KOIN. Aman, transparan, dan membantu membangun literasi keuangan sejak usia dini.
              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-5">
                <Link
                  href="/register/parent"
                  className="rounded-2xl bg-[#ffd84d] px-8 py-4 font-black text-[#10233f] transition hover:scale-105 hover:bg-[#ffe37a]"
                >
                  Daftar Orang Tua
                </Link>
                <Link
                  href="/register/canteen"
                  className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black transition hover:bg-white hover:text-[#10233f]"
                >
                  Daftar Kantin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#ede9fe] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <div>
            <KoinBrand />
            <p className="mt-3 max-w-md text-sm leading-7 text-[#58708e]">
              KOIN adalah ekosistem uang saku digital berbasis kartu NFC yang membantu sekolah, orang tua, siswa, dan kantin bertransaksi dengan lebih aman dan transparan.
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="font-black text-[#10233f]">
              Kenali • Olah • Ingat • Nabung
            </p>
            <p className="mt-2 text-sm text-[#58708e]">
              © 2026 KOIN. All Rights Reserved.
            </p>
            <p className="mt-1 text-sm text-[#58708e]">
              Dibuat dengan ❤️ untuk Masa Depan Pendidikan Indonesia
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
