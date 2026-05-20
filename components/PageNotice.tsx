export function PageNotice({
  error,
  success
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;

  return (
    <div className={`mb-5 rounded-3xl border px-5 py-4 text-sm font-semibold shadow-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
      <span className="mr-2">{error ? "Gagal:" : "Berhasil:"}</span>{error || success}
    </div>
  );
}
