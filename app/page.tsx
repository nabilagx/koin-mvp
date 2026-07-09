import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Ban,
  BookOpenCheck,
  Clock,
  CreditCard,
  History,
  Radio,
  School,
  ShieldCheck,
  Smartphone,
  Store,
  Users,
  WalletCards,
  Sparkles,
  TrendingUp,
  Star,
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
    <main className="min-h-screen bg-[#f7fbff] text-[#10233f] overflow-hidden">
            <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <KoinBrand />

          <div className="hidden items-center gap-8 font-semibold text-[#4d6686] lg:flex">
            <a
              href="#fitur"
              className="transition hover:text-[#1c77d2]"
            >
              Fitur
            </a>

            <a
              href="#ekosistem"
              className="transition hover:text-[#1c77d2]"
            >
              Ekosistem
            </a>

            <a
              href="#pilot"
              className="transition hover:text-[#1c77d2]"
            >
              Pilot
            </a>
          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="rounded-xl border border-[#dbeafe] bg-white px-5 py-3 font-semibold transition hover:shadow-md"
            >
              Masuk
            </Link>

            <Link
              href="/register/parent"
              className="rounded-xl bg-[#1c77d2] px-6 py-3 font-bold text-white transition hover:scale-105 hover:shadow-xl"
            >
              Daftar
            </Link>

          </div>

        </div>
      </nav>
            {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">

        {/* Background Blur */}
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-[#88d8ff]/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#ffd84d]/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#ffd84d]/20 px-4 py-2 text-sm font-bold text-[#10233f]">
              <Sparkles size={16} />
              Pilot Project • SMPN 2 Ambulu
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight lg:text-7xl">
              Digital Pocket
              <br />
              Money
              <span className="text-[#1c77d2]">
                {" "}
                for Smart
              </span>
              <br />
              Schools.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#4f6685]">
              KOIN membantu sekolah membangun ekosistem uang saku digital
              berbasis kartu NFC agar transaksi menjadi lebih aman,
              transparan, dan mendidik kebiasaan finansial sejak dini.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/register/parent"
                className="flex items-center gap-2 rounded-2xl bg-[#1c77d2] px-7 py-4 font-bold text-white transition hover:scale-105 hover:shadow-xl"
              >
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/register/canteen"
                className="rounded-2xl border border-[#dbeafe] bg-white px-7 py-4 font-bold transition hover:shadow-lg"
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
                  className="rounded-full border border-[#dbeafe] bg-white px-5 py-3 text-sm font-bold shadow-sm"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">

            <div className="relative">

              {/* Phone */}

              <div className="w-[340px] rounded-[40px] border-[10px] border-[#10233f] bg-white p-6 shadow-2xl">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-[#6b7d93]">
                      Selamat Datang
                    </p>

                    <h3 className="text-xl font-black">
                      Orang Tua
                    </h3>

                  </div>

                  <div className="rounded-full bg-[#1c77d2]/10 p-3">
                    <WalletCards
                      className="text-[#1c77d2]"
                      size={24}
                    />
                  </div>

                </div>

                <div className="mt-8 rounded-3xl bg-[#10233f] p-6 text-white">

                  <p className="text-sm text-white/70">
                    Saldo Anak
                  </p>

                  <h2 className="mt-2 text-4xl font-black">
                    Rp125.000
                  </h2>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl bg-[#f7fbff] p-4">

                    <Clock
                      className="text-[#1c77d2]"
                      size={24}
                    />

                    <p className="mt-4 text-sm text-[#5d728d]">
                      Limit Hari Ini
                    </p>

                    <h3 className="font-black">
                      Rp20.000
                    </h3>

                  </div>

                  <div className="rounded-2xl bg-[#f7fbff] p-4">

                    <History
                      className="text-[#1f9d68]"
                      size={24}
                    />

                    <p className="mt-4 text-sm text-[#5d728d]">
                      Transaksi
                    </p>

                    <h3 className="font-black">
                      18x
                    </h3>

                  </div>

                </div>

              </div>

              {/* NFC CARD */}

              <div className="absolute -left-20 top-24 w-56 rotate-[-12deg] rounded-3xl bg-[#10233f] p-6 text-white shadow-2xl">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold">
                    KOIN CARD
                  </span>

                  <CreditCard size={22} />

                </div>

                <h2 className="mt-12 text-3xl font-black">
                  KOIN
                </h2>

                <div className="mt-8 flex items-center justify-between">

                  <span className="text-sm text-white/70">
                    NFC
                  </span>

                  <Radio size={18} />

                </div>

              </div>

              {/* FLOATING */}

              <div className="absolute -right-10 top-8 rounded-2xl bg-white p-4 shadow-xl">

                <div className="flex items-center gap-3">

                  <TrendingUp
                    className="text-[#1f9d68]"
                    size={20}
                  />

                  <div>

                    <p className="text-xs text-[#64758b]">
                      Top Up
                    </p>

                    <h4 className="font-black">
                      Berhasil
                    </h4>

                  </div>

                </div>

              </div>

              <div className="absolute -bottom-5 right-0 rounded-2xl bg-[#ffd84d] p-4 shadow-xl">

                <div className="flex items-center gap-3">

                  <Star size={20} />

                  <div>

                    <p className="text-xs">
                      Cashless
                    </p>

                    <h4 className="font-black">
                      School Ready
                    </h4>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
            {/* ================= STATS ================= */}

      <section className="-mt-8 relative z-20 pb-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stats.map(({ title, value, icon: Icon }) => (

              <div
                key={title}
                className="group rounded-3xl border border-[#dbeafe] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="flex items-center justify-between">

                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1c77d2]/10">

                    <Icon
                      className="text-[#1c77d2]"
                      size={28}
                    />

                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#1c77d2] opacity-0 transition group-hover:opacity-100"
                  />

                </div>

                <h2 className="mt-8 text-4xl font-black">
                  {value}
                </h2>

                <p className="mt-2 text-[#60758f]">
                  {title}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>
            {/* ================= HOW IT WORKS ================= */}

      <section
        id="ekosistem"
        className="bg-white py-24"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <div className="inline-flex rounded-full bg-[#ffd84d]/20 px-5 py-2 text-sm font-bold">
              Cara Kerja KOIN
            </div>

            <h2 className="mt-6 text-5xl font-black">
              Satu Ekosistem
              <br />
              Empat Peran
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#60758f]">
              Semua pengguna saling terhubung dalam satu alur transaksi
              yang sederhana, aman, dan transparan.
            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-4">

            {[
              {
                title: "Orang Tua",
                desc: "Top up saldo, atur limit harian, kelola tabungan.",
                icon: Users,
              },
              {
                title: "Anak",
                desc: "Membayar di kantin menggunakan kartu NFC.",
                icon: BookOpenCheck,
              },
              {
                title: "Kantin",
                desc: "Menerima pembayaran lebih cepat tanpa uang tunai.",
                icon: Store,
              },
              {
                title: "Admin",
                desc: "Monitoring, audit, dan pengelolaan sekolah.",
                icon: ShieldCheck,
              },
            ].map(({ title, desc, icon: Icon }, index) => (

              <div
                key={title}
                className="relative"
              >

                <div className="rounded-[32px] border border-[#dbeafe] bg-[#f7fbff] p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#1c77d2]/10">

                    <Icon
                      className="text-[#1c77d2]"
                      size={30}
                    />

                  </div>

                  <h3 className="mt-8 text-2xl font-black">
                    {title}
                  </h3>

                  <p className="mt-4 leading-7 text-[#60758f]">
                    {desc}
                  </p>

                </div>

                {index < 3 && (
                  <div className="absolute right-[-28px] top-1/2 hidden -translate-y-1/2 lg:block">

                    <ArrowRight
                      className="text-[#1c77d2]"
                      size={28}
                    />

                  </div>
                )}

              </div>

            ))}

          </div>

        </div>
      </section>
            {/* ================= FLOW ================= */}

      <section className="pb-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="rounded-[36px] bg-[#10233f] p-10 text-white">

            <h2 className="text-4xl font-black">

              Alur Transaksi KOIN

            </h2>

            <p className="mt-4 max-w-2xl text-white/70">

              Dari orang tua hingga laporan sekolah,
              semua transaksi tercatat secara otomatis.

            </p>

            <div className="mt-14 grid gap-6 lg:grid-cols-5">

              {[
                "Top Up",
                "Saldo Masuk",
                "Tap NFC",
                "Pembayaran",
                "Riwayat",
              ].map((step, index) => (

                <div
                  key={step}
                  className="relative text-center"
                >

                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#ffd84d] text-2xl font-black text-[#10233f]">

                    {index + 1}

                  </div>

                  <h3 className="mt-6 font-bold">

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

      <section className="py-24 bg-[#f7fbff]">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-20 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <div className="inline-flex rounded-full bg-[#1c77d2]/10 px-5 py-2 text-sm font-bold text-[#1c77d2]">
                Mengapa Memilih KOIN?
              </div>

              <h2 className="mt-6 text-5xl font-black leading-tight">
                Satu Platform,
                <br />
                Banyak Manfaat.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#60758f]">
                KOIN dirancang agar orang tua, siswa, kantin,
                dan sekolah dapat menggunakan satu sistem yang
                sederhana namun tetap aman, transparan,
                dan mudah digunakan setiap hari.
              </p>

              <div className="mt-10 space-y-5">

                {[
                  [
                    "Aman & Transparan",
                    "Semua transaksi tercatat secara real-time."
                  ],

                  [
                    "Cashless NFC",
                    "Tidak perlu membawa uang tunai."
                  ],

                  [
                    "Kontrol Orang Tua",
                    "Atur limit dan pantau pengeluaran anak."
                  ],

                  [
                    "Belajar Menabung",
                    "Membentuk kebiasaan finansial sejak dini."
                  ],

                ].map(([title, desc]) => (

                  <div
                    key={title}
                    className="flex gap-5 rounded-3xl border border-[#dbeafe] bg-white p-6 transition hover:shadow-lg"
                  >

                    <div className="mt-1 grid h-12 w-12 place-items-center rounded-xl bg-[#1c77d2]/10">

                      <BadgeCheck
                        className="text-[#1c77d2]"
                        size={22}
                      />

                    </div>

                    <div>

                      <h3 className="font-black">
                        {title}
                      </h3>

                      <p className="mt-2 leading-7 text-[#60758f]">
                        {desc}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* RIGHT */}

            <div className="relative">

              <div className="rounded-[40px] bg-white p-8 shadow-2xl">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-[#60758f]">
                      Dashboard
                    </p>

                    <h3 className="text-2xl font-black">
                      Ringkasan Hari Ini
                    </h3>

                  </div>

                  <div className="rounded-2xl bg-[#1c77d2]/10 p-4">

                    <WalletCards
                      className="text-[#1c77d2]"
                      size={26}
                    />

                  </div>

                </div>

                <div className="mt-10 space-y-6">

                  <div>

                    <div className="flex justify-between">

                      <span>Saldo Anak</span>

                      <span className="font-black">
                        Rp125.000
                      </span>

                    </div>

                    <div className="mt-3 h-3 rounded-full bg-[#dbeafe]">

                      <div className="h-3 w-[82%] rounded-full bg-[#1c77d2]" />

                    </div>

                  </div>

                  <div>

                    <div className="flex justify-between">

                      <span>Limit Harian</span>

                      <span className="font-black">
                        Rp20.000
                      </span>

                    </div>

                    <div className="mt-3 h-3 rounded-full bg-[#dbeafe]">

                      <div className="h-3 w-[35%] rounded-full bg-[#ffd84d]" />

                    </div>

                  </div>

                  <div>

                    <div className="flex justify-between">

                      <span>Tabungan</span>

                      <span className="font-black">
                        Rp75.000
                      </span>

                    </div>

                    <div className="mt-3 h-3 rounded-full bg-[#dbeafe]">

                      <div className="h-3 w-[65%] rounded-full bg-[#1f9d68]" />

                    </div>

                  </div>

                </div>

              </div>

              {/* Floating */}

              <div className="absolute -left-8 top-12 rounded-3xl bg-[#10233f] p-5 text-white shadow-xl">

                <p className="text-xs text-white/70">
                  Transaksi Hari Ini
                </p>

                <h3 className="mt-2 text-3xl font-black">
                  18
                </h3>

              </div>

              <div className="absolute -right-6 bottom-8 rounded-3xl bg-[#ffd84d] p-5 shadow-xl">

                <p className="text-xs">
                  Cashless
                </p>

                <h3 className="mt-2 font-black">
                  NFC Ready
                </h3>

              </div>

            </div>

          </div>

        </div>

      </section>
            {/* ================= PILOT SCHOOL ================= */}

      <section
        id="pilot"
        className="py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <div className="inline-flex rounded-full bg-[#ffd84d]/20 px-5 py-2 text-sm font-bold">
              Roadmap Implementasi
            </div>

            <h2 className="mt-6 text-5xl font-black">

              Perjalanan KOIN

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#60758f]">

              Dimulai dari satu sekolah pilot,
              kemudian berkembang menjadi ekosistem
              pembayaran digital sekolah yang lebih luas.

            </p>

          </div>

          <div className="mt-20 relative">

            {/* Garis Timeline */}
            <div className="absolute left-0 right-0 top-8 hidden h-1 bg-[#dbeafe] lg:block" />

            <div className="grid gap-8 lg:grid-cols-4">

              {schools.map((school, index) => (

                <div
                  key={school.name}
                  className="relative text-center"
                >

                  {/* Titik Timeline */}
                  <div
                    className={`mx-auto grid h-16 w-16 place-items-center rounded-full shadow-lg ${
                      school.status === "Pilot Aktif"
                        ? "bg-[#1c77d2] text-white"
                        : "bg-white border-4 border-[#dbeafe]"
                    }`}
                  >
                    <School size={28} />
                  </div>

                  <div className="mt-8 rounded-[30px] border border-[#dbeafe] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${
                        school.status === "Pilot Aktif"
                          ? "bg-[#ffd84d]/30 text-[#10233f]"
                          : "bg-[#1c77d2]/10 text-[#1c77d2]"
                      }`}
                    >
                      {school.status}
                    </span>

                    <h3 className="mt-5 text-xl font-black">
                      {school.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#60758f]">
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

      {/* ================= CTA ================= */}

      <section className="pb-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="relative overflow-hidden rounded-[40px] bg-[#10233f] px-10 py-20 text-center text-white">

            {/* Background Blur */}
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#1c77d2]/30 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#ffd84d]/20 blur-3xl" />

            <div className="relative">

              <div className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-bold">
                Bergabung Bersama KOIN
              </div>

              <h2 className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-tight">

                Bangun Ekosistem
                <br />
                Uang Saku Digital
                <br />
                untuk Sekolah Indonesia.

              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">

                Mulai perjalanan digitalisasi sekolah
                bersama KOIN. Aman, transparan,
                dan membantu membangun literasi keuangan
                sejak usia dini.

              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-5">

                <Link
                  href="/register/parent"
                  className="rounded-2xl bg-[#ffd84d] px-8 py-4 font-black text-[#10233f] transition hover:scale-105"
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

      <footer className="border-t border-[#dbeafe] bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">

          <div>

            <KoinBrand />

            <p className="mt-3 max-w-md text-sm leading-7 text-[#60758f]">

              KOIN adalah ekosistem uang saku digital
              berbasis kartu NFC yang membantu sekolah,
              orang tua, siswa, dan kantin bertransaksi
              dengan lebih aman dan transparan.

            </p>

          </div>

          <div className="text-center md:text-right">

            <p className="font-black">
              Kenali • Olah • Ingat • Nabung
            </p>

            <p className="mt-2 text-sm text-[#60758f]">
              © 2026 KOIN. All Rights Reserved.
            </p>

            <p className="mt-1 text-sm text-[#60758f]">
              Built with ❤️ using Next.js & Supabase
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}
