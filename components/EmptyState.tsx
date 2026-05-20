import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function EmptyState({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-lilac/40 p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-mint shadow-sm">
        <Sparkles size={22} />
      </div>
      <p className="mt-3 font-black">{title}</p>
      {description ? <p className="mt-1 text-sm text-ink/60">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
