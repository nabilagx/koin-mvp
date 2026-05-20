import Link from "next/link";
import { registerCanteenAction } from "@/app/actions/auth";
import { AuthFrame } from "@/components/AuthFrame";
import { AuthNotice } from "@/components/AuthNotice";
import { SubmitButton } from "@/components/SubmitButton";

export default async function RegisterCanteenPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthFrame title="Daftar Kantin" subtitle="Aktifkan POS sekolah berbasis kartu NFC/RFID, produk menu, dan riwayat transaksi harian.">
      <div className="mt-5"><AuthNotice error={params.error} /></div>
      <form action={registerCanteenAction} className="mt-5 grid gap-4">
        <label className="block text-sm font-bold">Nama penanggung jawab<input className="field mt-1" name="name" required /></label>
        <input type="hidden" name="owner_name" value="" />
        <label className="block text-sm font-bold">Nama kantin<input className="field mt-1" name="canteen_name" required /></label>
        <label className="block text-sm font-bold">Nama sekolah<input className="field mt-1" name="school_name" /></label>
        <label className="block text-sm font-bold">Email<input className="field mt-1" name="email" type="email" required /></label>
        <label className="block text-sm font-bold">No. HP<input className="field mt-1" name="phone" /></label>
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold"><input name="has_nfc_device" type="checkbox" /> Punya perangkat NFC/RFID</label>
        <label className="block text-sm font-bold">Password<input className="field mt-1" name="password" type="password" minLength={6} required /></label>
        <SubmitButton className="btn-primary w-full" pendingText="Membuat akun...">Buat akun canteen</SubmitButton>
      </form>
      <p className="mt-5 text-center text-sm text-ink/60">Sudah punya akun? <Link className="font-black text-mint" href="/login">Login</Link></p>
    </AuthFrame>
  );
}
