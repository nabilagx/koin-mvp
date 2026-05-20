import Link from "next/link";

export function KoinBrand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="gold-gradient grid h-11 w-11 place-items-center rounded-full border-4 border-white text-xl font-black text-ink shadow-soft">K</span>
      <span>
        <span className="block text-xl font-black leading-none text-ink">KOIN</span>
        <span className="block text-[11px] font-bold text-mint">Kenali • Olah • Ingat • Nabung</span>
      </span>
    </Link>
  );
}
