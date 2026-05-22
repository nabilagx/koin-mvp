import Link from "next/link";
import { registerParentAction } from "@/app/actions/auth";
import { AuthFrame } from "@/components/AuthFrame";
import { AuthNotice } from "@/components/AuthNotice";
import { SubmitButton } from "@/components/SubmitButton";

export default async function RegisterParentPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthFrame title="Daftar Parent" subtitle="Buat akun orang tua untuk mengatur saldo, limit, kartu, celengan, dan misi anak.">
      <div className="mt-5"><AuthNotice error={params.error} /></div>
      <form action={registerParentAction} className="mt-5 grid gap-4">
        <label className="block text-sm font-bold">Nama lengkap<input className="field mt-1" name="name" required /></label>
        <label className="block text-sm font-bold">Email<input className="field mt-1" name="email" type="email" required /></label>
        <label className="block text-sm font-bold">No. HP<input className="field mt-1" name="phone" /></label>
        <label className="block text-sm font-bold">Alamat opsional<input className="field mt-1" name="address_optional" /></label>
        <label className="block text-sm font-bold">Password<input className="field mt-1" name="password" type="password" minLength={6} required /></label>
        <SubmitButton className="btn-primary w-full" pendingText="Membuat akun...">Buat akun orang tua</SubmitButton>
      </form>
      <p className="mt-5 text-center text-sm text-ink/60">Sudah punya akun? <Link className="font-black text-mint" href="/login">Login</Link></p>
    </AuthFrame>
  );
}
