"use client";

import { useState } from "react";
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
  PiggyBank,
  CheckCircle2,
} from "lucide-react";

import { KoinBrand } from "@/components/KoinBrand";

const schools = [
  {
    name: "SMPN 2 Ambulu",
    status: "Pilot Aktif",
    desc: "Sekolah pertama perintis ekosistem uang saku digital berbasis NFC.",
  },
  {
    name: "Sekolah Mitra",
    status: "Segera Hadir",
    desc: "Tahap koordinasi & pemetaan sarana kantin sehat bebas tunai.",
  },
  {
    name: "Sekolah Mitra",
    status: "Segera Hadir",
    desc: "Sosialisasi awal sistem tabungan siswa terintegrasi wali murid.",
  },
  {
    name: "Sekolah Mitra",
    status: "Segera Hadir",
    desc: "Digitalisasi pembayaran stand makanan sehat dalam satu kartu.",
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
    title: "Peran Pengguna",
    value: "4",
    icon: Users,
    badge: "Terintegrasi",
  },
  {
    title: "Transaksi Non-Tunai",
    value: "100%",
    icon: WalletCards,
    badge: "Aman",
  },
  {
    title: "Mesin NFC Siap",
    value: "24/7",
    icon: Radio,
    badge: "Realtime",
  },
];

const cardsData = [
  {
    id: 0,
    title: "KARTU SISWA NFC",
    label: "TAP & JAJAN",
    owner: "Rian Aditya",
    school: "SMPN 2 Ambulu",
    color: "bg-[#7c3aed]", // Lilac/Purple
    textColor: "text-white",
    accentColor: "text-[#ffd84d]",
    desc: "Kartu utama Rian untuk jajan sehat bebas tunai di lingkungan kantin sekolah dengan satu ketukan instan.",
    infoIcon: BookOpenCheck,
    balance: "Saldo Saku: Rp125.000"
  },
  {
    id: 1,
    title: "KARTU SISWA NFC",
    label: "KONTROL SAKU",
    owner: "Amanda Putri",
    school: "SMPN 2 Ambulu",
    color: "bg-[#10233f]", // Navy Blue
    textColor: "text-white",
    accentColor: "text-[#ffd84d]",
    desc: "Kartu saku harian Amanda yang diatur otomatis dengan batas belanja maksimal dari pengawasan wali murid.",
    infoIcon: Clock,
    balance: "Limit Saku: Rp20.000/Hari"
  },
  {
    id: 2,
    title: "KARTU SISWA NFC",
    label: "POIN SEHAT",
    owner: "Gibran Pratama",
    school: "SMPN 2 Ambulu",
    color: "bg-[#ffd84d]", // Gold
    textColor: "text-[#10233f]",
    accentColor: "text-[#7c3aed]",
    desc: "Kartu jajan Gibran yang otomatis mengumpulkan poin rewards prestasi setiap kali membeli buah segar di kantin.",
    infoIcon: Sparkles,
    balance: "Poin Loyalitas: 450 Poin"
  },
  {
    id: 3,
    title: "KARTU SISWA NFC",
    label: "CELENGAN SISWA",
    owner: "Keisha Kayla",
    school: "SMPN 2 Ambulu",
    color: "bg-[#1f9d68]", // Mint/Green
    textColor: "text-white",
    accentColor: "text-[#ffd84d]",
    desc: "Kartu pintar Keisha yang terintegrasi dengan rekening celengan sekolah untuk melatih kebiasaan gemar menabung.",
    infoIcon: PiggyBank,
    balance: "Tabungan Aktif: Rp75.000"
  }
];

export default function LandingPage() {
  const [cardStack, setCardStack] = useState([0, 1, 2, 3]);
  const [isSwiping, setIsSwiping] = useState(false);

  // Fungsi untuk memutar posisi tumpukan kartu (geser kartu terdepan ke paling belakang)
  const rotateCard = () => {
    if (isSwiping) return;
    setIsSwiping(true);
    
    // Tunggu animasi transisi geser keluar selesai baru ganti urutan index
    setTimeout(() => {
      setCardStack((prev) => {
        const next = [...prev];
        const top = next.shift();
        if (top !== undefined) next.push(top);
        return next;
      });
      setIsSwiping(false);
    }, 450);
  };

  const activeCardIndex = cardStack[0];
  const activeCard = cardsData[activeCardIndex];

  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#10233f] overflow-hidden selection:bg-[#7c3aed]/20">
      
      {/* ================= NAVIGASI RESPONSIF ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#ede9fe] bg-white/85 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Wrapper Logo: Di HP disembunyikan teksnya (hanya logo ikon), di laptop tampil penuh */}
          <div className="w-11 sm:w-auto overflow-hidden whitespace-nowrap transition-all duration-300 flex items-center">
            <KoinBrand />
          </div>

          <div className="hidden items-center gap-8 font-semibold text-[#58708e] lg:flex">
            <a
              href="#fitur"
              className="relative py-1 transition hover:text-[#7c3aed] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#7c3aed] after:transition-all"
            >
              Fitur
            </a>

            <a
              href="#ekosistem"
              className="relative py-1 transition hover:text-[#7c3aed] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#7c3aed] after:transition-all"
            >
              Ekosistem
            </a>

            <a
              href="#pilot"
              className="relative py-1 transition hover:text-[#7c3aed] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#7c3aed] after:transition-all"
            >
              Pilot
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-[#ede9fe] bg-white px-5 py-2.5 font-bold text-[#304866] transition hover:bg-[#f7fbff] hover:shadow-sm"
            >
              Masuk
            </Link>

            <Link
              href="/register/parent"
              className="group relative overflow-hidden rounded-xl bg-[#7c3aed] px-6 py-2.5 font-bold text-white shadow-md shadow-[#7c3aed]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#7c3aed]/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Daftar
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

        </div>
      </nav>

      {/* ================= HERO SECTION DENGAN 3D CARD STACK INTERAKTIF ================= */}
      <section className="relative overflow-hidden py-12 lg:py-20">

        {/* Ornamen Gradasi Lilac Lembut di Latar Belakang */}
        <div className="absolute left-[-10%] top-[10%] h-[400px] w-[400px] rounded-full bg-[#ede9fe]/60 blur-[120px] pointer-events-none" />
        <div className="absolute right-[-5%] top-[5%] h-[350px] w-[350px] rounded-full bg-[#ffd84d]/15 blur-[100px] pointer-events-none" />
        <div className="absolute right-[40%] bottom-[-5%] h-[250px] w-[250px] rounded-full bg-[#e9e3ff]/80 blur-[90px] pointer-events-none" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:gap-16 px-6 lg:grid-cols-12">

          {/* SISI KIRI: JUDUL UTAMA BAHASA INDONESIA & CTA */}
          <div className="lg:col-span-7">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#ede9fe] bg-white px-4 py-2 text-xs font-bold text-[#10233f] shadow-sm">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#1f9d68] animate-pulse" />
              <Sparkles size={14} className="text-[#ffd84d]" />
              Proyek Pilot • SMPN 2 Ambulu
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.15] text-[#10233f] sm:text-5xl lg:text-6xl xl:text-7xl">
              Uang Saku
              <br />
              <span className="relative inline-block text-white">
                <span className="absolute inset-0 -skew-y-1 bg-[#7c3aed] rounded-lg shadow-md shadow-[#7c3aed]/10" />
                <span className="relative px-3 py-1">Digital</span>
              </span>
              <span className="text-[#7c3aed]"> untuk Sekolah</span>
              <br />
              Pintar.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#58708e] sm:text-lg">
              KOIN membantu sekolah membangun ekosistem uang saku digital berbasis kartu NFC yang aman, transparan, serta mengajarkan literasi finansial bijak sejak dini kepada anak Anda.
            </p>

            {/* Tombol Aksi Utama */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register/parent"
                className="flex items-center gap-2 rounded-2xl bg-[#7c3aed] px-8 py-4 font-extrabold text-white shadow-lg shadow-[#7c3aed]/25 transition hover:scale-105 hover:bg-[#6d28d9] hover:shadow-xl"
              >
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/register/canteen"
                className="rounded-2xl border border-[#ede9fe] bg-white px-8 py-4 font-bold text-[#304866] transition hover:bg-[#f7fbff] hover:shadow-md"
              >
                Daftar Sebagai Kantin
              </Link>
            </div>

            {/* Logo Pendukung Finansial */}
            <div className="mt-12 border-t border-[#ede9fe]/80 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#58708e]">
                Didukung & Selaras Dengan
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

          {/* SISI KANAN: PREVIEW DEK KARTU 3D STACK INTERAKTIF (AMBUL & BEBAS POTONG) */}
          {/* Area Wadah Utama Dek Kartu */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-6">
            
            <div className="relative w-full max-w-[340px] h-[250px] sm:h-[280px] flex items-center justify-center">
              
              {/* Petunjuk Mengambang */}
              <button 
                onClick={rotateCard}
                className="absolute -top-6 z-40 bg-[#10233f] text-[#ffd84d] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-[#ffd84d]/30 flex items-center gap-1.5 hover:scale-105 transition active:scale-95 animate-bounce"
              >
                <Radio size={12} className="animate-pulse" />
                Ketuk Kartu untuk Mengganti
              </button>

              {/* Tumpukan Kartu */}
              {cardStack.map((cardIndex, position) => {
                const card = cardsData[cardIndex];
                const isTop = position === 0;

                // Konfigurasi visual 3D bertingkat berdasarkan posisi antrean tumpukan
                let transformStyle = "";
                let opacityStyle = "";
                let zIndexStyle = "";

                if (position === 0) {
                  // Kartu paling depan (aktif)
                  transformStyle = isSwiping 
                    ? "translate-x-full translate-y-[-20px] rotate-[15deg] scale-95 opacity-0"
                    : "translate-y-0 scale-100 rotate-0";
                  opacityStyle = "opacity-100 cursor-pointer";
                  zIndexStyle = "z-30 shadow-2xl";
                } else if (position === 1) {
                  // Kartu kedua
                  transformStyle = "translate-y-4 scale-95 rotate-[-2deg]";
                  opacityStyle = "opacity-90 pointer-events-none";
                  zIndexStyle = "z-20 shadow-xl";
                } else if (position === 2) {
                  // Kartu ketiga
                  transformStyle = "translate-y-8 scale-90 rotate-[2deg]";
                  opacityStyle = "opacity-80 pointer-events-none";
                  zIndexStyle = "z-10 shadow-lg";
                } else {
                  // Kartu keempat (paling belakang, tidak kelihatan dulu)
                  transformStyle = "translate-y-12 scale-85 rotate-0";
                  opacityStyle = "opacity-0 pointer-events-none";
                  zIndexStyle = "z-0";
                }

                return (
                  <div
                    key={card.id}
                    onClick={isTop ? rotateCard : undefined}
                    className={`absolute w-[290px] h-[175px] sm:w-[320px] sm:h-[195px] rounded-3xl p-5 ${card.color} ${card.textColor} border border-white/20 transition-all duration-500 ease-out select-none ${transformStyle} ${opacityStyle} ${zIndexStyle}`}
                  >
                    {/* Header Kartu */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-widest opacity-80 uppercase">
                        {card.title}
                      </span>
                      <CreditCard size={18} className={card.accentColor} />
                    </div>

                    {/* Tengah Kartu (Chip NFC & Sinyal Wireless) */}
                    <div className="mt-6 flex items-end justify-between">
                      {/* Desain Chip NFC */}
                      <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-amber-300 via-amber-200 to-yellow-500 border border-amber-600/30 flex flex-col justify-between p-1.5">
                        <div className="h-[1px] bg-amber-800/20 w-full" />
                        <div className="h-[1px] bg-amber-800/20 w-full" />
                        <div className="h-[1px] bg-amber-800/20 w-full" />
                      </div>
                      <Radio size={18} className="animate-pulse" />
                    </div>

                    {/* Informasi Pemilik & Label Tap */}
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-[9px] opacity-75 uppercase tracking-wide">Pemilik Kartu</p>
                        <h4 className="text-sm font-black tracking-wide leading-tight mt-0.5">
                          {card.owner}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-white/20`}>
                          {card.label}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Bayangan Dasar di HP agar terasa 3D */}
              <div className="absolute -bottom-2 w-[260px] h-4 bg-black/10 blur-md rounded-full -z-10" />

            </div>

            {/* Keterangan Kartu yang Sedang Aktif di Depan */}
            <div className="mt-8 text-center px-4 max-w-[340px] transition-all duration-300">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ede9fe] text-[#7c3aed] px-3 py-1 text-xs font-black">
                {activeCard.infoIcon && <activeCard.infoIcon size={14} />}
                {activeCard.balance}
              </div>
              <h4 className="mt-2 text-md font-black text-[#10233f]">
                {activeCard.title} ({activeCard.owner})
              </h4>
              <p className="mt-1.5 text-xs text-[#58708e] leading-relaxed">
                {activeCard.desc}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= SEKSI STATISTIK UTAMA ================= */}
      <section className="relative z-20 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ title, value, icon: Icon, badge }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-[#ede9fe] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Latar Belakang Dekoratif Lilac Saat Hover */}
                <div className="absolute right-0 top-0 h-16 w-16 bg-[#e9e3ff] opacity-0 transition-opacity duration-300 group-hover:opacity-40 rounded-bl-full" />
                
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7c3aed]/15 text-[#7c3aed]">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-full bg-[#ede9fe]/50 px-2.5 py-0.5 text-[10px] font-bold text-[#7c3aed]">
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

      {/* ================= SEKSI CARA KERJA SISTEM ================= */}
      <section id="ekosistem" className="bg-white py-24 border-y border-[#ede9fe]/80">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ffd84d]/20 px-4 py-1.5 text-xs font-bold text-[#10233f] uppercase tracking-wider">
              Cara Kerja KOIN
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#10233f] sm:text-5xl">
              Satu Ekosistem,
              <br />
              <span className="text-[#7c3aed]">Empat Peran Sinergis</span>
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
                color: "bg-[#7c3aed]/10 text-[#7c3aed]",
              },
              {
                title: "Siswa (Anak)",
                desc: "Membayar jajanan di kantin sehat cukup dengan melakukan tap kartu NFC KOIN yang praktis.",
                icon: BookOpenCheck,
                color: "bg-[#e9e3ff]/80 text-[#8b5cf6]",
              },
              {
                title: "Kantin Mitra",
                desc: "Menerima pembayaran instan nirkabel tanpa repot mengurus uang kembalian atau resiko kehilangan.",
                icon: Store,
                color: "bg-[#ffd84d]/25 text-[#10233f]",
              },
              {
                title: "Sekolah Admin",
                desc: "Memperoleh data dashboard kesehatan finansial kantin dan menaikkan gengsi sekolah modern.",
                icon: ShieldCheck,
                color: "bg-[#1f9d68]/15 text-[#1f9d68]",
              },
            ].map(({ title, desc, icon: Icon, color }, index) => (
              <div
                key={title}
                className="relative group rounded-3xl border border-[#ede9fe] bg-[#f7fbff] p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:bg-white"
              >
                
                {/* Badge Langkah Visual */}
                <div className="absolute top-4 right-4 text-4xl font-extrabold text-[#ede9fe]/60 group-hover:text-[#7c3aed]/20">
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

      {/* ================= ALUR TRANSAKSI DETIL ================= */}
      <section className="py-24 bg-[#f7fbff]">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="rounded-[40px] bg-[#10233f] p-8 sm:p-14 text-white relative overflow-hidden">
            
            {/* Hiasan Gradasi Berpendar */}
            <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-[#7c3aed]/40 blur-3xl" />
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
                  { title: "Isi Saldo", sub: "Via Mobile Banking / Dompet Digital" },
                  { title: "Atur Limit Harian", sub: "Agar anak belajar berhemat" },
                  { title: "Tap Kartu Siswa", sub: "Pembayaran super cepat" },
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

      {/* ================= KEUNGGULAN KOIN ================= */}
      <section id="fitur" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-12">

            {/* SISI KIRI: Nilai Utama Fitur */}
            <div className="lg:col-span-6">
              <div className="inline-flex rounded-full bg-[#7c3aed]/10 px-4 py-1.5 text-xs font-bold text-[#7c3aed] uppercase tracking-wider">
                Mengapa Harus KOIN?
              </div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-[#10233f] sm:text-5xl">
                Menjaga Jajanan Anak
                <br />
                <span className="text-[#7c3aed]">Tetap Terkontrol & Sehat</span>
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
                    badgeColor: "text-[#7c3aed]",
                  },
                  {
                    title: "Batas Belanja Anak",
                    desc: "Atur maksimum belanja harian agar tidak boros.",
                    icon: PiggyBank,
                    badgeColor: "text-purple-500",
                  },
                  {
                    title: "Laporan Riwayat Realtime",
                    desc: "Notifikasi masuk langsung saat kartu KOIN ditap.",
                    icon: TrendingUp,
                    badgeColor: "text-[#1f9d68]",
                  },
                ].map(({ title, desc, icon: Icon, badgeColor }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-[#ede9fe] bg-[#f7fbff] p-5 transition-all hover:bg-white hover:shadow-md"
                  >
                    <div className={`mt-0.5 rounded-xl bg-[#ede9fe]/40 p-2.5 ${badgeColor}`}>
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

            {/* SISI KANAN: Visualisasi Monitor Dasbor Sisa Limit */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-[40px] bg-gradient-to-tr from-[#10233f] to-[#304866] p-8 text-white shadow-2xl relative overflow-hidden">
                
                {/* Hiasan Pendar */}
                <div className="absolute right-0 bottom-0 h-48 w-48 bg-[#7c3aed]/20 rounded-full blur-3xl" />
                
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
                      <div className="h-2 rounded-full bg-[#7c3aed]" style={{ width: "84%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Limit Harian (Terpakai)</span>
                      <span className="font-black text-white">Rp20.000 / Rp20.000 (Habis)</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-[#1f9d68]" style={{ width: "100%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Rencana Tabungan Anak</span>
                      <span className="font-black text-[#ffd84d]">Rp75.000</span>
                    </div>
                    <div className="mt-2.5 h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-purple-400" style={{ width: "60%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-white/5 p-4 flex items-center justify-between text-xs text-white/80">
                  <span>Proteksi Kartu Aktif</span>
                  <span className="flex items-center gap-1 text-[#1f9d68] font-bold">
                    <span className="h-2 w-2 rounded-full bg-[#1f9d68]" /> Mode Aman
                  </span>
                </div>

              </div>

              {/* Status Enkripsi Mengambang */}
              <div className="absolute -left-8 -bottom-8 rounded-3xl bg-white p-5 shadow-xl border border-[#ede9fe] flex items-center gap-3">
                <div className="rounded-full bg-[#1f9d68]/15 p-3 text-[#1f9d68]">
                  <BadgeCheck size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-[#58708e]">Verifikasi Enkripsi</p>
                  <h4 className="font-black text-[#10233f] text-sm">100% NFC Aman</h4>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= PETA JALAN & SEKOLAH PILOT ================= */}
      <section id="pilot" className="py-24 bg-[#f7fbff]">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ffd84d]/20 px-4 py-1.5 text-xs font-bold text-[#10233f] uppercase tracking-wider">
              Peta Jalan Implementasi
            </div>
            <h2 className="mt-4 text-3xl font-black text-[#10233f] sm:text-5xl">
              Langkah Digitalisasi Sekolah
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#58708e]">
              Berikut adalah jaringan sekolah pilot perdana dan rencana ekspansi jangkauan saku pintar digital KOIN di Indonesia.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {schools.map((school) => {
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
                    </div>

                    <h3 className="mt-4 text-lg font-black text-[#10233f]">
                      {school.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[#58708e]">
                      {school.desc}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#ede9fe]/80 pt-4 flex items-center gap-2 text-xs text-[#304866] font-bold">
                    <School size={14} className="text-[#7c3aed]" />
                    <span>Mitra Pendidikan</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= AJAKAN GABUNG (CTA) ================= */}
      <section className="pb-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="relative overflow-hidden rounded-[40px] bg-[#10233f] px-6 py-20 text-center text-white sm:px-12">
            
            {/* Hiasan Pendar Latar Belakang */}
            <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-[#7c3aed]/30 blur-[100px]" />
            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#ffd84d]/15 blur-[100px]" />

            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#ffd84d] uppercase tracking-wider">
                Gabung KOIN Sekarang
              </span>

              <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
                Saatnya Mewujudkan
                <br />
                <span className="text-[#ffd84d]">Sekolah Non-Tunai Masa Kini</span>
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

      {/* ================= KAKI HALAMAN (FOOTER) ================= */}
      <footer className="border-t border-[#ede9fe] bg-[#f7fbff] py-12">
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
                Dibuat dengan ❤️ menggunakan Next.js, Tailwind CSS & Supabase
              </p>
            </div>

          </div>
        </div>
      </footer>

    </main>
  );
}
