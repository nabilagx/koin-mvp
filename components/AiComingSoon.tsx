import { Sparkles } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function AiComingSoon({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <section className="panel overflow-hidden rounded-lg p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lilac text-mint">
              <Sparkles size={22} />
            </span>
            <StatusBadge status="Coming Soon" />
          </div>
          <h2 className="mt-5 text-2xl font-black">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">{description}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div className="rounded-3xl border border-line bg-white p-4 text-sm font-black text-ink/70 shadow-sm" key={item}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
