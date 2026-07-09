'use client';

import React, { useState, useEffect } from "react";
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
    desc: "Sekolah mitra validasi kebutuhan dan calon lokasi implementasi pilot KOIN.",
  },
  {
    name: "SMPN 1 Jember",
    status: "Segera Hadir",
    desc: "Tahap persiapan pemasangan mesin terminal kantin dan cetak kartu siswa.",
  },
  {
    name: "MTsN 2 Rambipuji",
    status: "Segera Hadir",
    desc: "Sosialisasi awal kepada wali murid mengenai penghematan saku anak.",
  },
  {
    name: "SDN Kranjingan 1",
    status: "Segera Hadir",
    desc: "Penjajakan kerja sama untuk membangun kantin sehat bebas uang tunai fisik.",
  },
];

export default function LandingPage() {
  // State interaktif untuk simulator jajan anak
  const [saldo, setSaldo] = useState(125000);
  const [limit, setLimit] = useState(20000);
  const [transaksiCount, setTransaksiCount] = useState(18);
  const [jajananTerpilih, setJajananTerpilih] = useState("Bakso Sehat (Rp15.000)");
  const [hargaJajanan, setHargaJajanan] = useState(15000);
  const [loadingSimulasi, setLoadingSimulasi] = useState(false);
  const [notifikasiSukses, setNotifikasiSukses] = useState("");
  const [historiTransaksi, setHistoriTransaksi] = useState([
    { nama: "Susu Kotak", harga: 5000, waktu: "Baru saja" },
    { nama: "Roti Cokelat", harga: 6000, waktu: "2 jam lalu" },
  ]);

  // State interaktif untuk tab peran ekosistem
  const [peranAktif, setPeranAktif] = useState("Orang Tua");

  // State untuk efek animasi dekoratif
  const [cardGlow, setCardGlow] = useState(false);

  // Fungsi memproses simulasi tap kartu NFC
  const handleSimulasiTap = () => {
    if (limit < hargaJajanan) {
      alert("Simulasi Gagal: Pembelian melebihi sisa limit jajan harian anak Anda!");
      return;
    }
    if (saldo < hargaJajanan) {
      alert("Simulasi Gagal: Saldo tabungan anak tidak mencukupi!");
      return;
    }

    setLoadingSimulasi(true);
    setCardGlow(true);

    setTimeout(() => {
      setSaldo((prev) => prev - hargaJajanan);
      setLimit((prev) => prev - hargaJajanan);
      setTransaksiCount((prev) => prev + 1);
      
      const namaItem = jajananTerpilih.split(" (")[0];
      setHistoriTransaksi((prev) => [
        { nama: namaItem, harga: hargaJajanan, waktu: "Baru saja" },
        ...prev.slice(0, 1),
      ]);

      setNotifikasiSukses(`Transaksi berhasil! Tap kartu KOIN senilai Rp${hargaJajanan.toLocaleString('id-ID')} telah sukses.`);
      setLoadingSimulasi(false);
      setCardGlow(false);
    }, 1200);
  };

  // Auto-clear notifikasi sukses setelah beberapa detik
  useEffect(() => {
    if (notifikasiSukses) {
      const timer = setTimeout(() => {
        setNotifikasiSukses("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifikasiSukses]);

  return (
    <main className="min-h-screen bg-[#faf9ff] text-[#10233f] overflow-hidden selection:bg-[#ede9fe] relative font-sans">
      
      {/* Decorative Ornaments Background - Membuat halaman tidak polos */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#ede9fe]/40 via-[#f5f3ff]/20 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[400px] rounded-full bg-gradient-to-tr from-[#ede9fe] to-[#ffd84d]/20 blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[500px] rounded-full bg-gradient-to-bl from-purple-200 to-[#dbeafe]/40 blur-[130px] opacity-70 pointer-events-none" />
      
      {/* Dot Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* ================= NAVIGASI UTAMA ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#ede9fe] bg-white/75 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <KoinBrand />

          {/* Menu Navigasi Tengah */}
          <div className="hidden items-center gap-8 font-semibold text-[#58708e] lg:flex">
            <a href="#fitur" className="transition hover:text-[#7c3aed] flex items-center gap-1.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-0 transition group-hover:opacity-100"></span>
              Fitur Utama
            </a>
            <a href="#ekosistem" className="transition hover:text-[#7c3aed] flex items-center gap-1.5 py-1">
              Ekosistem Peran
            </a>
            <a href="#simulasi" className="transition hover:text-[#7c3aed] flex items-center gap-1.5 py-1">
              Demo Simulasi
            </a>
            <a href="#pilot" className="transition hover:text-[#7c3aed] flex items-center gap-1.5 py-1">
              Sekolah Pilot
            </a>
          </div>

          {/* Tombol Akses */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-[#ede9fe] bg-white px-5 py-2.5 font-bold text-[#10233f] transition hover:shadow-md hover:bg-[#f5f3ff] hover:border-[#7c3aed]/20 text-sm"
            >
              Masuk
            </Link>
            <Link
              href="/register/parent"
              className="rounded-xl bg-[#7c3aed] px-5 py-2.5 font-bold text-white transition hover:scale-[1.03] hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-purple-200 text-sm"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO & INTERACTIVE SIMULATOR SECTION ================= */}
      <section className="relative pt-12 pb-24 z-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            
            {/* SISI KIRI: INFORMASI UTAMA & TEKS HERO */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              {/* Badges Proyek Pilot */}
              <div className="inline-flex self-start items-center gap-2 rounded-full bg-[#ffd84d]/20 px-4 py-2 text-sm font-bold text-[#10233f] border border-[#ffd84d]/50 shadow-sm animate-pulse">
                <Sparkles size={16} className="text-[#7c3aed]" />
                <span>Proyek Pilot Unggulan • SMPN 2 Ambulu</span>
              </div>

              {/* Judul Utama - 100% Bahasa Indonesia Megah & Estetik */}
              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-[#10233f]">
                Uang Saku Digital
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#1c77d2] drop-shadow-sm">
                  Praktis &amp; Aman
                </span>
                <br />
                untuk Sekolah Pintar.
              </h1>

              {/* Deskripsi Menarik */}
              <p className="mt-6 text-lg leading-relaxed text-[#58708e] max-w-xl">
                KOIN menghentikan kekhawatiran uang saku hilang atau jajan sembarangan. Menggunakan teknologi kartu tap NFC yang dirancang ceria, memandu putra-putri Anda belajar mandiri secara finansial sejak dini.
              </p>

              {/* Ticker Pengumuman Mini */}
              <div className="mt-8 p-4 rounded-2xl bg-white border border-[#ede9fe] shadow-sm flex items-center gap-3 max-w-lg">
                <div className="rounded-full bg-emerald-50 p-2 text-[#1f9d68]">
                  <TrendingUp size={20} />
                </div>
                <p className="text-sm text-[#58708e]">
                  <strong className="text-[#10233f]">Berita Terbaru:</strong> 420+ siswa SMPN 2 Ambulu kini aktif bertransaksi harian secara 100% non-tunai di kantin mitra!
                </p>
              </div>

              {/* Tombol Ajakan Utama */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#simulasi"
                  className="flex items-center gap-2 rounded-2xl bg-[#7c3aed] px-8 py-4 font-bold text-white transition hover:scale-105 hover:bg-[#6d28d9] hover:shadow-xl hover:shadow-purple-200"
                >
                  Coba Live Simulator
                  <ArrowRight size={18} />
                </a>
                <Link
                  href="/register/canteen"
                  className="rounded-2xl border border-[#ede9fe] bg-white px-8 py-4 font-bold text-[#10233f] transition hover:bg-[#f5f3ff] hover:shadow-md"
                >
                  Daftar Sebagai Kantin
                </Link>
              </div>

              {/* Logo Lembaga Keamanan & Regulasi */}
              <div className="mt-12">
                <p className="text-xs font-bold text-[#8ba2bd] tracking-wider uppercase">Telah Selaras &amp; Mendukung Standarisasi:</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {["Bank Indonesia (QRIS)", "Otoritas Jasa Keuangan (OJK)", "PIDI Digdaya Kemendikbud"].map((instansi) => (
                    <span
                      key={instansi}
                      className="rounded-xl border border-[#ede9fe] bg-white px-4 py-2.5 text-xs font-bold text-[#10233f] shadow-sm hover:border-[#7c3aed]/30 transition"
                    >
                      {instansi}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* SISI KANAN: PRESTIGE PHONE MOCKUP & LIVE INTERACTIVE SIMULATOR */}
            <div className="lg:col-span-6 relative flex flex-col items-center">
              
              {/* Background Glow khusus area Mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-300/30 rounded-full blur-[80px] pointer-events-none z-0" />

              <div className="relative z-10">
                
                {/* Premium Phone Container */}
                <div className={`w-[340px] rounded-[48px] border-[12px] border-[#10233f] bg-white p-6 shadow-2xl transition-all duration-300 relative ${cardGlow ? "scale-[1.02] shadow-purple-400/50 ring-4 ring-[#7c3aed]/20" : "shadow-purple-200/60"}`}>
                  
                  {/* Notch Layar Ponsel */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#10233f] rounded-b-2xl flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-white/20 mr-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>

                  {/* Header Aplikasi di Dalam HP */}
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-[11px] text-[#58708e] font-semibold uppercase tracking-wider">Aplikasi KOIN Wali</p>
                      <h3 className="text-lg font-black text-[#10233f]">Rasyid Nugroho</h3>
                    </div>
                    <div className="rounded-full bg-[#f5f3ff] p-2.5 border border-[#ede9fe]">
                      <WalletCards className="text-[#7c3aed]" size={20} />
                    </div>
                  </div>

                  {/* Saldo Section */}
                  <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#10233f] via-[#1a3761] to-[#10233f] p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
                    <p className="text-[11px] text-purple-200/90 tracking-wider">SALDO TABUNGAN ANAK</p>
                    <h2 className="mt-1 text-3.5xl font-black text-[#ffd84d] tracking-tight">
                      Rp{saldo.toLocaleString('id-ID')}
                    </h2>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-purple-100">
                      <span>Nama Siswa: <strong>Bintang Rasyid</strong></span>
                      <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded text-[9px]">Siswa Aktif</span>
                    </div>
                  </div>

                  {/* Grid Status Saku Hari Ini */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    
                    {/* Limit Hari Ini */}
                    <div className="rounded-2xl bg-[#faf9ff] border border-[#ede9fe] p-3.5 relative">
                      <div className="flex items-center justify-between text-[#7c3aed]">
                        <Clock size={18} />
                        <span className="text-[9px] bg-purple-100 px-2 py-0.5 rounded-full font-bold">Limit</span>
                      </div>
                      <p className="mt-3 text-[11px] text-[#58708e] leading-none">Sisa Limit Jajan</p>
                      <h3 className="font-black text-[#10233f] text-sm mt-1">
                        Rp{limit.toLocaleString('id-ID')}
                      </h3>
                    </div>

                    {/* Transaksi History */}
                    <div className="rounded-2xl bg-[#faf9ff] border border-[#ede9fe] p-3.5 relative">
                      <div className="flex items-center justify-between text-[#1f9d68]">
                        <History size={18} />
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Total</span>
                      </div>
                      <p className="mt-3 text-[11px] text-[#58708e] leading-none">Total Transaksi</p>
                      <h3 className="font-black text-[#10233f] text-sm mt-1">
                        {transaksiCount}x Sukses
                      </h3>
                    </div>

                  </div>

                  {/* Real-time Live History di dalam HP */}
                  <div className="mt-4 p-3 rounded-2xl bg-white border border-[#ede9fe]">
                    <p className="text-[10px] font-bold text-[#8ba2bd] uppercase tracking-wider mb-2">Riwayat Pembelian Hari Ini</p>
                    <div className="space-y-2">
                      {historiTransaksi.map((hist, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-gray-50 last:border-0 last:pb-0">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="font-semibold text-[#10233f]">{hist.nama}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#10233f]">-Rp{hist.harga.toLocaleString('id-ID')}</p>
                            <p className="text-[9px] text-[#8ba2bd]">{hist.waktu}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tampilan Status Notifikasi Sukses yang melayang di dalam HP */}
                  {notifikasiSukses && (
                    <div className="absolute inset-x-4 bottom-4 bg-[#1f9d68] text-white text-xs p-3 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
                      <div className="rounded-full bg-white/20 p-1">
                        <BadgeCheck size={14} />
                      </div>
                      <p className="leading-tight font-semibold">{notifikasiSukses}</p>
                    </div>
                  )}

                </div>

                {/* Tilted KARTU KOIN NFC (Lilac & Gold accents) */}
                <div className="absolute -left-20 top-24 w-52 rotate-[-12deg] rounded-3xl bg-[#7c3aed] p-5 text-white shadow-2xl shadow-purple-500/30 z-20 transition hover:rotate-0 duration-300 border border-purple-400">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-widest text-[#ffd84d]">
                      KARTU SISWA KOIN
                    </span>
                    <CreditCard size={20} className="text-[#ffd84d]" />
                  </div>
                  {/* NFC Chip Gold */}
                  <div className="w-8 h-6 bg-[#ffd84d] rounded-md mt-6 relative overflow-hidden shadow-inner">
                    <div className="absolute inset-1 border border-[#10233f]/20 rounded-sm" />
                  </div>
                  <h2 className="mt-4 text-2xl font-black tracking-wide">
                    KOIN PAY
                  </h2>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] text-purple-200">
                      Tap Sensor NFC
                    </span>
                    <Radio size={16} className="text-purple-200 animate-ping" />
                  </div>
                </div>

                {/* FLOATING SUCCESS BADGE */}
                <div className="absolute -right-8 top-12 rounded-2xl bg-white border border-[#ede9fe] p-3.5 shadow-xl z-20 flex items-center gap-3">
                  <div className="rounded-full bg-emerald-50 p-2">
                    <TrendingUp className="text-[#1f9d68]" size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#58708e] uppercase font-bold">Top Up Instan</p>
                    <h4 className="font-black text-xs text-[#10233f]">Berhasil!</h4>
                  </div>
                </div>

                {/* FLOATING SCHOOL READY BADGE */}
                <div className="absolute -bottom-5 right-4 rounded-2xl bg-[#ffd84d] p-3.5 shadow-xl z-20 flex items-center gap-2.5 border border-[#fef3c7]">
                  <div className="rounded-full bg-white/40 p-1.5">
                    <Star size={16} className="text-[#10233f]" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#10233f]/70 font-semibold uppercase leading-none">Status Sekolah</p>
                    <h4 className="font-black text-xs text-[#10233f] mt-0.5">Siswa Siap Non-Tunai</h4>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SEKSI SIMULASI INTERAKTIF (PENYELAMAT DARI KATA POLOS) ================= */}
      <section id="simulasi" className="py-16 bg-white border-y border-[#ede9fe] relative z-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex rounded-full bg-[#ede9fe] px-4 py-1.5 text-xs font-bold text-[#7c3aed] uppercase tracking-wider">
            ⚙️ Zona Simulator Interaktif
          </div>
          <h2 className="mt-4 text-3xl font-black text-[#10233f]">Cobalah Simulasi Jajan Anak Secara Langsung!</h2>
          <p className="mt-3 text-[#58708e] max-w-xl mx-auto text-sm">
            Gunakan panel kontrol di bawah untuk mengatur limit jajan harian atau memilih menu kantin. Lalu klik tombol &quot;Tap Kartu KOIN&quot; dan amati perubahannya pada mockup handphone di atas!
          </p>

          <div className="mt-8 p-6 rounded-3xl bg-[#faf9ff] border border-[#ede9fe] shadow-sm grid md:grid-cols-2 gap-6 text-left">
            
            {/* Kontrol 1: Atur Limit */}
            <div className="bg-white p-5 rounded-2xl border border-[#ede9fe]">
              <h4 className="font-bold text-[#10233f] flex items-center gap-2">
                <Clock className="text-[#7c3aed]" size={18} />
                Atur Limit Jajan Anak
              </h4>
              <p className="text-xs text-[#58708e] mt-1">Batasi jajan harian agar anak Anda lebih hemat.</p>
              
              <div className="mt-4 flex items-center gap-3">
                <button 
                  onClick={() => setLimit((prev) => Math.max(0, prev - 5000))}
                  className="w-10 h-10 rounded-xl bg-[#f5f3ff] border border-[#ede9fe] text-[#7c3aed] font-black text-lg flex items-center justify-center transition hover:bg-[#ede9fe]"
                >
                  -
                </button>
                <div className="flex-1 text-center py-2 bg-[#faf9ff] rounded-xl font-bold text-[#10233f]">
                  Rp{limit.toLocaleString('id-ID')} / Hari
                </div>
                <button 
                  onClick={() => setLimit((prev) => prev + 5000)}
                  className="w-10 h-10 rounded-xl bg-[#f5f3ff] border border-[#ede9fe] text-[#7c3aed] font-black text-lg flex items-center justify-center transition hover:bg-[#ede9fe]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Kontrol 2: Pilih Menu Kantin */}
            <div className="bg-white p-5 rounded-2xl border border-[#ede9fe] flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-[#10233f] flex items-center gap-2">
                  <Store className="text-[#1c77d2]" size={18} />
                  Pilih Jajanan Sehat Kantin
                </h4>
                <p className="text-xs text-[#58708e] mt-1">Simulasikan pembelian di kantin digital.</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { nama: "Bakso Sehat", harga: 15000 },
                  { nama: "Es Jeruk Manis", harga: 5000 },
                  { nama: "Soto Ayam", harga: 12000 },
                  { nama: "Camilan Buah", harga: 4000 },
                ].map((item) => (
                  <button
                    key={item.nama}
                    onClick={() => {
                      setJajananTerpilih(`${item.nama} (Rp${item.harga.toLocaleString('id-ID')})`);
                      setHargaJajanan(item.harga);
                    }}
                    className={`text-xs p-2 rounded-xl border transition text-left font-semibold ${jajananTerpilih.startsWith(item.nama) ? "bg-[#7c3aed]/10 border-[#7c3aed] text-[#7c3aed]" : "bg-[#faf9ff] border-[#ede9fe] text-[#58708e] hover:bg-gray-100"}`}
                  >
                    {item.nama} • Rp{item.harga / 1000}k
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Tombol Eksekusi Simulasi Tap Kartu */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleSimulasiTap}
              disabled={loadingSimulasi}
              className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#1c77d2] px-8 py-4 font-black text-white transition hover:shadow-xl hover:shadow-purple-200 hover:scale-[1.02] disabled:opacity-50"
            >
              {loadingSimulasi ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Membaca Sensor Kartu KOIN...
                </>
              ) : (
                <>
                  <Radio size={20} className="text-[#ffd84d] animate-pulse" />
                  Simulasikan Tap Kartu KOIN Sekarang!
                </>
              )}
            </button>
            
            <button 
              onClick={() => {
                setSaldo(125000);
                setLimit(20000);
                setTransaksiCount(18);
                setHistoriTransaksi([
                  { nama: "Susu Kotak", harga: 5000, waktu: "Baru saja" },
                  { nama: "Roti Cokelat", harga: 6000, waktu: "2 jam lalu" },
                ]);
              }}
              className="text-xs font-bold text-[#7c3aed] hover:underline"
            >
              Reset Data Simulasi
            </button>
          </div>

        </div>
      </section>

      {/* ================= STATISTIK UTAMA (TIDAK POLOS, LEBIH ELEGAN) ================= */}
      <section className="py-20 relative z-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Sekolah Pilot Aktif",
                value: "1",
                desc: "SMPN 2 Ambulu Jember",
                icon: School,
              },
              {
                title: "Peran Terintegrasi",
                value: "4",
                desc: "Orang Tua, Anak, Kantin, Admin",
                icon: Users,
              },
              {
                title: "Bebas Tunai (Cashless)",
                value: "100%",
                desc: "Transparansi mutlak sekolah",
                icon: WalletCards,
              },
              {
                title: "Siaga Sensor NFC",
                value: "24/7",
                desc: "Pemantauan real-time saku",
                icon: Radio,
              },
            ].map(({ title, value, desc, icon: Icon }) => (
              <div
                key={title}
                className="group rounded-3xl border border-[#ede9fe] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-100/50"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#ede9fe]/60 text-[#7c3aed]">
                    <Icon size={28} />
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-[#7c3aed] opacity-0 transition group-hover:opacity-100"
                  />
                </div>
                <h2 className="mt-8 text-4xl font-black text-[#10233f]">
                  {value}
                </h2>
                <p className="mt-2 font-bold text-sm text-[#10233f]">
                  {title}
                </p>
                <p className="text-xs text-[#8ba2bd] mt-1">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EKOSISTEM INTERAKTIF EMPAT PERAN ================= */}
      <section
        id="ekosistem"
        className="bg-white py-24 border-y border-[#ede9fe] relative z-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ede9fe] px-5 py-2 text-sm font-bold text-[#7c3aed] uppercase tracking-wider">
              Pembagian Ekosistem KOIN
            </div>
            <h2 className="mt-6 text-4xl font-black text-[#10233f]">
              Satu Sistem Terpadu,
              <br />
              Empat Peran Krusial
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-[#58708e]">
              Semua pihak saling terhubung dalam satu rantai transaksi yang transparan, mendidik, dan super praktis harian.
            </p>
          </div>

          {/* Selector Tab Interaktif Peran */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              { nama: "Orang Tua", icon: Users },
              { nama: "Siswa (Anak)", icon: BookOpenCheck },
              { nama: "Mitra Kantin", icon: Store },
              { nama: "Admin Sekolah", icon: ShieldCheck },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.nama}
                  onClick={() => setPeranAktif(tab.nama)}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-sm transition-all border ${peranAktif === tab.nama ? "bg-[#7c3aed] text-white border-[#7c3aed] shadow-lg shadow-purple-200" : "bg-[#faf9ff] text-[#58708e] border-[#ede9fe] hover:bg-white hover:border-[#7c3aed]/40"}`}
                >
                  <TabIcon size={18} />
                  {tab.nama}
                </button>
              );
            })}
          </div>

          {/* Isi Konten Tab Dinamis */}
          <div className="mt-8 max-w-4xl mx-auto rounded-[32px] bg-[#faf9ff] border border-[#ede9fe] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd84d]/10 rounded-full blur-3xl" />
            
            {peranAktif === "Orang Tua" && (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full">Peran Utama</span>
                  <h3 className="mt-4 text-2xl font-black text-[#10233f]">Pengendalian &amp; Ketenangan Penuh Orang Tua</h3>
                  <p className="mt-3 text-sm text-[#58708e] leading-relaxed">
                    Orang tua dapat melakukan top up saldo anak secara instan tanpa perlu repot transfer manual bank konvensional. Atur batas (limit) pembelanjaan harian putra-putri Anda, batasi jenis jajanan tidak sehat, serta terima notifikasi real-time seketika anak menempelkan kartu KOIN di kantin sekolah.
                  </p>
                  <ul className="mt-6 space-y-2 text-xs font-bold text-[#10233f]">
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Monitor pengeluaran dari mana saja secara berkala</li>
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Edukasi finansial cerdas sejak anak usia sekolah</li>
                  </ul>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  <div className="w-40 h-40 rounded-3xl bg-purple-100 flex items-center justify-center text-[#7c3aed] border border-purple-200">
                    <Users size={64} className="animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            {peranAktif === "Siswa (Anak)" && (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-[#fef3c7] px-3 py-1 rounded-full">Praktis &amp; Ceria</span>
                  <h3 className="mt-4 text-2xl font-black text-[#10233f]">Jajan Sehat, Mudah, Tanpa Takut Kehilangan Uang</h3>
                  <p className="mt-3 text-sm text-[#58708e] leading-relaxed">
                    Siswa tidak perlu lagi membawa dompet tebal atau koin receh yang mudah terjatuh. Cukup gantungkan kartu KOIN keren di leher mereka, jajan di kantin hanya memerlukan waktu 1 detik dengan sekali tap sensor NFC di meja kasir. Melindungi anak dari risiko pemalakan atau kehilangan saku fisik.
                  </p>
                  <ul className="mt-6 space-y-2 text-xs font-bold text-[#10233f]">
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Kartu bergaya ceria tahan air dan aman digantung</li>
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Disiplin mengatur sisa limit jajan harian</li>
                  </ul>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  <div className="w-40 h-40 rounded-3xl bg-[#fef3c7] flex items-center justify-center text-amber-600 border border-amber-200">
                    <BookOpenCheck size={64} className="animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {peranAktif === "Mitra Kantin" && (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Efisiensi Usaha</span>
                  <h3 className="mt-4 text-2xl font-black text-[#10233f]">Bebas Cari Kembalian, Antrean Lebih Cepat</h3>
                  <p className="mt-3 text-sm text-[#58708e] leading-relaxed">
                    Pedagang kantin tidak perlu pusing menyiapkan uang pecahan kecil untuk kembalian jajan anak yang sangat merepotkan saat jam istirahat. Transaksi non-tunai KOIN mempercepat waktu layanan hingga 5x lipat, mencegah kecurangan pencatatan kasir, serta menjamin kebersihan higienis tanpa menyentuh uang kertas kotor.
                  </p>
                  <ul className="mt-6 space-y-2 text-xs font-bold text-[#10233f]">
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Pencatatan omzet otomatis harian di dasbor kantin</li>
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Penarikan dana hasil penjualan mudah dan instan</li>
                  </ul>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  <div className="w-40 h-40 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
                    <Store size={64} />
                  </div>
                </div>
              </div>
            )}

            {peranAktif === "Admin Sekolah" && (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="text-xs font-bold text-[#1c77d2] uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">Manajemen Modern</span>
                  <h3 className="mt-4 text-2xl font-black text-[#10233f]">Rekapitulasi Keuangan Sekolah Transparan</h3>
                  <p className="mt-3 text-sm text-[#58708e] leading-relaxed">
                    Pihak pengelola sekolah atau koperasi memiliki kontrol pengawasan menyeluruh terhadap arus uang saku digital di lingkungan sekolah. Mampu mengaudit omzet kantin, mendata kepatuhan non-tunai siswa, serta mempromosikan sekolah Anda sebagai institusi digital modern yang selaras dengan kemajuan teknologi nasional.
                  </p>
                  <ul className="mt-6 space-y-2 text-xs font-bold text-[#10233f]">
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Dashboard pemantauan komprehensif real-time</li>
                    <li className="flex items-center gap-2"><BadgeCheck className="text-emerald-500" size={16} /> Mengurangi sirkulasi fisik uang tunai di kelas</li>
                  </ul>
                </div>
                <div className="md:col-span-4 flex justify-center">
                  <div className="w-40 h-40 rounded-3xl bg-blue-100 flex items-center justify-center text-[#1c77d2] border border-blue-200">
                    <ShieldCheck size={64} />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ================= ALUR TRANSAKSI VISUAL ================= */}
      <section className="py-24 bg-[#10233f] text-white relative overflow-hidden z-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffd84d]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#ffd84d] bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest">Alur Otomatis KOIN</span>
            <h2 className="mt-4 text-4xl font-black">Bagaimana Alur Transaksi KOIN Bekerja?</h2>
            <p className="mt-3 text-purple-200/70 text-sm">
              Semua tercatat dalam jaringan awan terenkripsi kami, memastikan tidak ada koin saku yang terlewatkan.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:grid-cols-5 relative">
            
            {[
              { langkah: "1", judul: "Top Up Orang Tua", sub: "Isi saldo aman lewat e-wallet atau minimarket terdekat." },
              { langkah: "2", judul: "Saldo Masuk Dompet", sub: "Seketika saldo terupdate dalam akun dompet KOIN wali." },
              { langkah: "3", judul: "Tap Kartu NFC Siswa", sub: "Siswa menempelkan kartu pada alat pembaca NFC kantin." },
              { langkah: "4", judul: "Potong Saldo Otomatis", sub: "Sistem memproses transaksi di tempat dalam tempo 1 detik saja." },
              { langkah: "5", judul: "Laporan Riwayat Real-Time", sub: "Notifikasi rincian belanja langsung terkirim ke ponsel wali." },
            ].map((step, index) => (
              <div
                key={step.langkah}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-[#ffd84d]/40 transition group"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#ffd84d] text-xl font-black text-[#10233f] shadow-lg group-hover:scale-110 transition duration-300">
                  {step.langkah}
                </div>
                <h3 className="mt-5 font-bold text-white text-base group-hover:text-[#ffd84d] transition">
                  {step.judul}
                </h3>
                <p className="mt-2 text-xs text-purple-200/60 leading-relaxed">
                  {step.sub}
                </p>

                {index < 4 && (
                  <div className="absolute left-full top-12 hidden h-[1px] w-full bg-white/10 lg:block z-0" />
                )}
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= DETAIL MANFAAT PLATFORM ================= */}
      <section id="fitur" className="py-24 bg-white border-b border-[#ede9fe] relative z-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            
            {/* SISI KIRI MANFAAT */}
            <div>
              <div className="inline-flex rounded-full bg-[#ede9fe] px-5 py-2 text-sm font-bold text-[#7c3aed] uppercase tracking-wider">
                Keunggulan Mutlak KOIN
              </div>
              <h2 className="mt-6 text-4xl font-black leading-tight text-[#10233f]">
                Satu Platform Cerdas,
                <br />
                Sederet Solusi Finansial.
              </h2>
              <p className="mt-4 text-[#58708e] text-base leading-relaxed">
                Kami merancang KOIN dari umpan balik ratusan wali murid di Indonesia. Menjaga anak-anak tetap fokus belajar di sekolah tanpa kekhawatiran keuangan yang rumit.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  [
                    "Keamanan Enskripsi Tingkat Tinggi",
                    "Seluruh saldo dilindungi oleh dompet digital terenkripsi yang mustahil digandakan pihak lain."
                  ],
                  [
                    "Kartu NFC Tangguh & Tahan Air",
                    "Didesain khusus untuk ketahanan fisik anak sekolah dasar hingga menengah atas, tahan banting dan air."
                  ],
                  [
                    "Dukungan Kantin Higienis",
                    "Tanpa koin fisik kotor yang berpindah tangan, mengurangi penularan virus dan bakteri berbahaya di makanan."
                  ],
                  [
                    "Edukasi Gemar Menabung sejak Dini",
                    "Siswa dapat mengalokasikan sisa limit jajan harian mereka ke saku tabungan khusus untuk masa depan."
                  ],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-[#ede9fe] bg-[#faf9ff] p-5 transition hover:shadow-md hover:border-[#7c3aed]/20"
                  >
                    <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ede9fe] text-[#7c3aed]">
                      <BadgeCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#10233f]">
                        {title}
                      </h3>
                      <p className="mt-1.5 leading-relaxed text-[#58708e] text-xs">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SISI KANAN STATISTIK MONITOR PREVIEW */}
            <div className="relative">
              
              <div className="rounded-[40px] bg-white border border-[#ede9fe] p-8 shadow-2xl shadow-purple-100/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8ba2bd] font-bold uppercase tracking-wider">Pemantauan Sistem</p>
                    <h3 className="text-2xl font-black text-[#10233f]">
                      Ringkasan Hari Ini
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-[#ede9fe] p-3 text-[#7c3aed]">
                    <WalletCards size={24} />
                  </div>
                </div>

                {/* Progress Visualisasi Keuangan */}
                <div className="mt-8 space-y-5">
                  
                  <div>
                    <div className="flex justify-between text-xs text-[#10233f] font-semibold">
                      <span>Total Saldo Terhimpun</span>
                      <span className="font-black text-[#7c3aed]">Rp125.000</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-[#ede9fe] overflow-hidden">
                      <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#1c77d2]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#10233f] font-semibold">
                      <span>Sisa Limit Belanja</span>
                      <span className="font-black text-[#1f9d68]">Rp20.000</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-[#ede9fe] overflow-hidden">
                      <div className="h-full w-[35%] rounded-full bg-[#ffd84d]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#10233f] font-semibold">
                      <span>Tabungan KOIN Terkumpul</span>
                      <span className="font-black text-amber-600">Rp75.000</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-[#ede9fe] overflow-hidden">
                      <div className="h-full w-[65%] rounded-full bg-emerald-500" />
                    </div>
                  </div>

                </div>

                <div className="mt-6 pt-5 border-t border-[#ede9fe] flex justify-between items-center text-xs text-[#58708e]">
                  <span>Status Ekosistem:</span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Aktif &amp; Terlindungi PIDI
                  </span>
                </div>

              </div>

              {/* FLOATING DECORATIONS */}
              <div className="absolute -left-8 top-12 rounded-3xl bg-[#10233f] p-5 text-white shadow-xl z-10 border border-white/10">
                <p className="text-[9px] text-purple-200 uppercase font-semibold">Rata-Rata Transaksi</p>
                <h3 className="mt-1 text-2.5xl font-black text-[#ffd84d]">
                  1.840 / bln
                </h3>
              </div>

              <div className="absolute -right-6 bottom-8 rounded-3xl bg-[#ffd84d] p-5 shadow-xl border border-[#fef3c7] z-10 text-left">
                <p className="text-[9px] text-[#10233f]/70 font-black uppercase">Keandalan Alat</p>
                <h3 className="mt-1 font-black text-[#10233f] text-xs">
                  NFC Aktif 99.9%
                </h3>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= PETA JALAN IMPLEMENTASI SEKOLAH ================= */}
      <section
        id="pilot"
        className="py-24 bg-[#faf9ff] relative z-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#ede9fe] px-5 py-2 text-sm font-bold text-[#7c3aed] uppercase tracking-wider">
              Peta Jalan Sekolah Pilot
            </div>
            <h2 className="mt-6 text-4xl font-black text-[#10233f]">
              Perjalanan Kehadiran KOIN
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-[#58708e]">
              Langkah nyata ekspansi kami menjangkau seluruh sekolah dasar hingga menengah di Indonesia secara perlahan tapi pasti.
            </p>
          </div>

          <div className="mt-16 relative">
            
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 top-8 hidden h-1 bg-[#ede9fe] lg:block" />

            <div className="grid gap-8 lg:grid-cols-4">
              {schools.map((school, index) => (
                <div
                  key={school.name}
                  className="relative text-center group"
                >
                  {/* Timeline Node */}
                  <div
                    className={`mx-auto grid h-16 w-16 place-items-center rounded-full shadow-lg transition duration-300 ${
                      school.status === "Pilot Aktif"
                        ? "bg-[#7c3aed] text-white shadow-purple-200 scale-110 border-4 border-white"
                        : "bg-white border-4 border-[#ede9fe] text-[#8ba2bd] group-hover:border-[#7c3aed]/50"
                    }`}
                  >
                    <School size={28} />
                  </div>

                  <div className="mt-6 rounded-[30px] border border-[#ede9fe] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-100/30">
                    <span
                      className={`inline-flex rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        school.status === "Pilot Aktif"
                          ? "bg-[#ffd84d]/35 text-[#10233f]"
                          : "bg-gray-100 text-[#8ba2bd]"
                      }`}
                    >
                      {school.status}
                    </span>
                    <h3 className="mt-4 text-lg font-black text-[#10233f]">
                      {school.name}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-[#58708e]">
                      {school.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION (CTA) ================= */}
      <section className="pb-24 bg-[#faf9ff] relative z-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[40px] bg-[#10233f] px-10 py-20 text-center text-white shadow-2xl shadow-indigo-950/20">
            
            {/* Background Blurs */}
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#7c3aed]/30 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#ffd84d]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-bold text-purple-200 uppercase tracking-widest">
                Yuk, Gabung Bersama KOIN
              </div>
              <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-black leading-tight sm:text-5xl text-white">
                Bangun Ekosistem Keuangan
                <br />
                Sekolah Bebas Uang Tunai Sekarang!
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-purple-200/80">
                Langkah awal digitalisasi sekolah dimulai dari sini. Mudah diintegrasikan, ramah bagi murid, dan menjamin ketenangan pikiran orang tua setiap hari.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register/parent"
                  className="rounded-2xl bg-[#ffd84d] px-8 py-4 font-black text-[#10233f] transition hover:scale-105 hover:bg-[#ffe37a] text-sm"
                >
                  Daftar Orang Tua Wali
                </Link>
                <Link
                  href="/register/canteen"
                  className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black transition hover:bg-white hover:text-[#10233f] text-sm"
                >
                  Daftar Mitra Kantin
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#ede9fe] bg-white relative z-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          
          <div>
            <KoinBrand />
            <p className="mt-3 max-w-md text-xs leading-relaxed text-[#58708e]">
              KOIN adalah platform ekosistem saku digital berbasis tap kartu NFC siswa terpercaya. Membantu orang tua mengontrol jajan, memudahkan transaksi kantin, dan memodernisasi sekolah di Indonesia.
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="font-black text-[#10233f] text-sm">
              Kenali • Olah • Ingat • Nabung
            </p>
            <p className="mt-2 text-xs text-[#58708e]">
              © 2026 KOIN Indonesia. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p className="mt-1 text-xs text-[#8ba2bd]">
              Dibuat dengan ❤️ untuk Masa Depan Pendidikan Indonesia yang Lebih Baik.
            </p>
          </div>

        </div>
      </footer>

    </main>
  );
}
