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
  WalletCards 
} from "lucide-react";
import { KoinBrand } from "@/components/KoinBrand";

const schools = [
  { name: "SMPN 2 Ambulu", status: "Pilot Aktif" },
  { name: "Sekolah Mitra Berikutnya", status: "Segera Hadir" },
  { name: "Komunitas Belajar", status: "Segera Hadir" },
  { name: "Kantin Sekolah Mitra", status: "Segera Hadir" }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#10233f] overflow-x-hidden selection:bg-[#1c77d2]/10 selection:text-[#1c77d2]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-line/20 bg-[#f7fbff]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <KoinBrand />
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="btn-secondary px-5 py-2 text-sm font-semibold transition-all duration-200 hover:opacity-80"
            >
              Masuk
            </Link>
            <Link 
              href="/register/parent" 
              className="btn-primary px-5 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col justify-center space-y-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/30 px-4 py-1.5 text-xs font-black text-ink uppercase tracking-wider mb-4 animate-pulse">
              🚀 Pilot Project: SMPN 2 Ambulu
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1c77d2] mb-1">
              KOIN • Kenali • Olah • Ingat • Nabung
            </p>
            <h1 className="text-5xl font-black leading-[1.1] sm:text-6xl tracking-tight">
              KOIN
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-[#17375f] leading-snug sm:text-3xl">
              Ekosistem uang saku digital berbasis kartu NFC untuk sekolah.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-[#304866]">
              Orang tua memantau, anak belajar mengelola uang, kantin bertransaksi lebih aman dan praktis.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Link 
              href="/register/parent" 
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3.5 font-bold shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Daftar sebagai Orang Tua
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="/register/canteen" 
              className="btn-secondary flex items-center justify-center px-6 py-3.5 font-bold transition-all duration-300 hover:bg-black/5 hover:-translate-y-0.5"
            >
              Daftar Kantin
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-4 text-xs font-bold text-[#304866]">
            <span className="text-[#304866]/60 uppercase tracking-wider mr-1 text-[10px]">Didukung oleh:</span>
            {["Bank Indonesia", "OJK", "PIDI Digdaya"].map((item) => (
              <span 
                className="rounded-full border border-[#dbeafe] bg-white px-3.5 py-1.5 shadow-sm hover:border-[#1c77d2]/30 transition-colors cursor-default" 
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Interactive Card Mockup */}
        <div className="relative flex items-center justify-center py-6">
          {/* Decorative Backdrops */}
          <div className="absolute right-10 top-6 h-32 w-32 rounded-full bg-[#ffd84d]/60 blur-xl pointer-events-none" />
          <div className="absolute left-10 bottom-10 h-28 w-28 rounded-full bg-[#88d8ff]/40 blur-xl pointer-events-none" />
          
          <div className="absolute right-4 top-0 h-20 w-20 rounded-full bg-[#ffd84d] opacity-80" />
          <div className="absolute left-6 top-16 h-8 w-8 rounded-full bg-[#88d8ff] opacity-80" />
          <div className="absolute bottom-8 left-4 h-14 w-14 rounded-full border-4 border-[#ffd84d]/60" />

          {/* Card Showcase Panel */}
          <div className="panel relative w-full max-w-sm rounded-3xl p-6 shadow-xl border border-line/10 bg-white/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            {/* NFC Card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#10233f] p-6 text-white shadow-lg transition-transform duration-500 hover:scale-[1.03]">
              {/* Card mesh gradient overlay */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
              
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  KOIN CARD
                </span>
                <CreditCard size={22} className="opacity-80" />
              </div>
              <p className="mt-14 text-4xl font-black tracking-tight">KOIN</p>
              <p className="mt-1 text-xs text-white/60 tracking-wide font-medium">Tap NFC/RFID di kantin sekolah</p>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-white/50 font-medium">Pilot 2026</span>
                <span className="flex items-center gap-1.5 rounded-full bg-[#ffd84d] px-2.5 py-1 text-[10px] font-black text-[#10233f]">
                  <Radio size={12} className="animate-pulse" /> NFC ACTIVE
                </span>
              </div>
            </div>

            {/* Micro Dashboard Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3.5">
              <div className="rounded-2xl border border-[#dbeafe] bg-white p-4 shadow-sm hover:border-[#1c77d2]/30 transition-all">
                <div className="inline-flex rounded-lg bg-[#1c77d2]/10 p-2 text-[#1c77d2]">
                  <WalletCards size={20} />
                </div>
                <p className="mt-3 text-xs font-semibold text-[#58708e]">Saldo anak</p>
                <p className="text-lg font-black tracking-tight mt-0.5">Rp125.000</p>
              </div>
              <div className="rounded-2xl border border-[#dbeafe] bg-white p-4 shadow-sm hover:border-[#1f9d68]/30 transition-all">
                <div className="inline-flex rounded-lg bg-[#1f9d68]/10 p-2 text-[#1f9d68]">
                  <ShieldCheck size={20} />
                </div>
                <p className="mt-3 text-xs font-semibold text-[#58708e]">Sisa limit</p>
                <p className="text-lg font-black tracking-tight mt-0.5">Rp20.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pills / Grid */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {[
            ["Limit Harian", Clock],
            ["Transaksi Kantin", Store],
            ["Celengan KOIN", WalletCards],
            ["Blokir Kartu", Ban],
            ["Riwayat Transaksi", History]
          ].map(([label, Icon]) => (
            <div 
              className="koin-card flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white border border-line/10 rounded-2xl" 
              key={String(label)}
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lilac text-mint shadow-inner">
                <Icon size={22} />
              </div>
              <p className="mt-4 text-xs font-black tracking-wide text-[#10233f]">{String(label)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="koin-card overflow-hidden rounded-3xl border border-line/10 bg-white p-8 shadow-sm md:p-10">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-mint">
              Ekosistem KOIN di Sekolah
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Satu alur untuk semua peran
            </h2>
            <p className="mt-3 text-[#304866]">
              Menggabungkan kenyamanan pengelolaan wali murid dengan kemudahan operasional sekolah dalam satu sistem terintegrasi.
            </p>
          </div>
          
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Orang Tua", "Top Up, atur limit jajan harian anak, pantau kartu, dan simpan celengan secara berkala.", Users],
              ["Anak", "Jajan dengan aman, belajar mengelola batasan jajan mandiri, dan berlatih menabung sejak dini.", BookOpenCheck],
              ["Kantin", "Sistem kasir (POS) super ringkas yang dioperasikan cukup menggunakan kartu NFC.", Store],
              ["Admin", "Pantau ekosistem keuangan secara komprehensif, kelola laporan berkala, serta audit sistem terpusat.", ShieldCheck]
            ].map(([title, desc, Icon]) => (
              <div 
                className="group flex flex-col justify-between rounded-2xl border border-line bg-white/50 p-6 transition-all duration-300 hover:border-[#1c77d2]/30 hover:bg-white hover:shadow-md" 
                key={String(title)}
              >
                <div>
                  <div className="inline-flex rounded-xl bg-[#f7fbff] p-3 text-mint group-hover:bg-[#1c77d2]/10 group-hover:text-[#1c77d2] transition-colors">
                    <Icon size={24} />
                  </div>
                  <p className="mt-5 font-black text-lg text-[#10233f]">{String(title)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{String(desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages & PWA/Multi-device Section */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Advantages */}
        <div className="koin-card flex flex-col justify-between p-8 rounded-3xl border border-line/10 bg-white shadow-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-mint">Keunggulan KOIN</p>
            <h3 className="mt-2 text-2xl font-black text-[#10233f]">Mengapa Sekolah Memilih KOIN?</h3>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Aman dan terpercaya", 
              "Tanpa uang tunai", 
              "Transparan untuk orang tua", 
              "Mendidik anak disiplin menabung", 
              "Mudah digunakan", 
              "Bisa diakses semua perangkat"
            ].map((item) => (
              <div 
                className="flex items-center gap-3.5 rounded-2xl bg-[#f7fbff] border border-line/5 p-4 transition-all hover:bg-white hover:shadow-sm" 
                key={item}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lilac text-mint">
                  <BadgeCheck size={16} />
                </div>
                <span className="font-bold text-sm text-[#10233f]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: PWA Info */}
        <div className="koin-card flex flex-col justify-between p-8 rounded-3xl border border-line/10 bg-[#10233f] text-white shadow-lg relative overflow-hidden">
          {/* Subtle gradient pattern behind */}
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          
          <div>
            <div className="inline-flex rounded-xl bg-white/10 p-3 text-[#ffd84d]">
              <Smartphone size={28} />
            </div>
            <h3 className="mt-5 text-2xl font-black tracking-tight">Akses Multi-Device / PWA</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              KOIN dapat dijalankan secara lancar dari browser sekolah, laptop admin, tablet kantin, maupun smartphone pribadi orang tua tanpa memerlukan proses instalasi yang rumit.
            </p>
          </div>

          <div className="mt-8 space-y-3.5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-semibold text-white/80 backdrop-blur-sm">
              ✨ Tambahkan ke layar utama (Add to Home Screen) untuk pengalaman penggunaan setara aplikasi asli.
            </div>
            <div className="rounded-2xl border border-[#ffd84d]/30 bg-[#ffd84d]/10 p-4 text-xs font-semibold text-[#ffd84d]/90 backdrop-blur-sm">
              💡 MVP mendukung penuh pembacaan NFC langsung pada Chrome Android/HTTPS. Tersedia juga Mode Demo Tanpa Kartu NFC pada POS kantin untuk memudahkan simulasi penilaian jarak jauh.
            </div>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1c77d2]">Jaringan Sekolah</p>
          <h2 className="mt-2 text-3xl font-black text-[#10233f]">Telah & Akan Segera Hadir di</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {schools.map((school) => (
            <div 
              className="panel group rounded-2xl p-6 border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#1c77d2]/20" 
              key={school.name}
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-[#f7fbff] p-2.5 text-[#1c77d2] group-hover:bg-[#1c77d2]/10 transition-colors">
                  <School size={20} />
                </div>
                <span 
                  className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    school.status === "Pilot Aktif" 
                      ? "bg-gold/30 text-ink" 
                      : "bg-lilac text-mint"
                  }`}
                >
                  {school.status}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-[#58708e]">
                  {school.status === "Pilot Aktif" ? "Sekolah Pilot Utama" : "Rencana Integrasi"}
                </p>
                <p className="mt-1 text-lg font-black tracking-tight text-[#10233f]">{school.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line/30 bg-white px-6 py-10 text-center">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-left">
            <p className="text-lg font-black text-[#10233f] tracking-wider">KOIN</p>
            <p className="text-xs font-semibold text-[#58708e] mt-0.5">Kenali • Olah • Ingat • Nabung</p>
          </div>
          <p className="text-xs text-[#58708e]/70 font-semibold">
            &copy; {new Date().getFullYear()} KOIN Ecosystem. Seluruh Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </main>
  );
}
