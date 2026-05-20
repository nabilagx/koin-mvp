const toneByStatus: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  settlement: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  open: "border-amber-200 bg-amber-50 text-amber-700",
  in_review: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-blue-200 bg-blue-50 text-blue-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  suspended: "border-red-200 bg-red-50 text-red-700",
  blocked: "border-red-200 bg-red-50 text-red-700",
  frozen: "border-violet-200 bg-violet-50 text-violet-700",
  replaced: "border-slate-200 bg-slate-50 text-slate-700",
  expired: "border-slate-200 bg-slate-50 text-slate-700",
  cancelled: "border-slate-200 bg-slate-50 text-slate-700"
};

export function StatusBadge({ status }: { status?: string | null }) {
  const value = status || "-";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${toneByStatus[value] ?? "border-line bg-white text-ink/70"}`}>
      {value}
    </span>
  );
}
