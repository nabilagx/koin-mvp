import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  accent = "bg-lilac text-mint"
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accent?: string;
}) {
  return (
    <div className="koin-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-ink/55">{label}</p>
          <div className="mt-2 text-2xl font-black">{value}</div>
        </div>
        {icon ? <div className={`grid h-12 w-12 place-items-center rounded-2xl ${accent}`}>{icon}</div> : null}
      </div>
    </div>
  );
}
