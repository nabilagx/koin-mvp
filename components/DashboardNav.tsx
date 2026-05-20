import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function DashboardNav({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <nav className="mb-6 flex gap-2 overflow-x-auto rounded-[1.5rem] border border-white/80 bg-white/80 p-2 shadow-sm backdrop-blur">
      {links.map((link) => (
        <Link className="inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black text-ink/65 transition hover:bg-lilac hover:text-mint" href={link.href} key={link.href}>
          {link.label}
          <ChevronRight size={14} />
        </Link>
      ))}
    </nav>
  );
}
