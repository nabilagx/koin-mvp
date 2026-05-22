import Link from "next/link";
import { AuthFrame } from "@/components/AuthFrame";
import { AuthNotice } from "@/components/AuthNotice";
import { SubmitButton } from "@/components/SubmitButton";
import { loginAction } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthFrame title="Masuk ke KOIN" subtitle="Akses dashboard admin, orang tua, anak, atau kantin sesuai peran akun Anda.">
      <div className="mt-5"><AuthNotice error={params.error} success={params.success} /></div>
      <form action={loginAction} className="mt-5 space-y-4">
        <label className="block text-sm font-bold">
          Email
          <input className="field mt-1" name="email" type="email" required />
        </label>
        <label className="block text-sm font-bold">
          Password
          <input className="field mt-1" name="password" type="password" required />
        </label>
        <SubmitButton className="btn-primary w-full" pendingText="Masuk...">Masuk</SubmitButton>
      </form>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Link className="btn-secondary" href="/register/parent">Daftar Orang Tua</Link>
        <Link className="btn-secondary" href="/register/canteen">Daftar Kantin</Link>
      </div>
    </AuthFrame>
  );
}
