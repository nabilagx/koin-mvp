"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthNotice({
  error,
  success
}: {
  error?: string;
  success?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(Boolean(error || success));
  const isError = Boolean(error);

  useEffect(() => {
    if (!error && !success) return;
    setOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    params.delete("success");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [error, pathname, router, searchParams, success]);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (!error && !success) return null;
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-ink/30 px-4 backdrop-blur-sm"
      role={isError ? "alertdialog" : "dialog"}
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white p-6 text-center shadow-glow" onClick={(event) => event.stopPropagation()}>
        <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${isError ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
          {isError ? <XCircle size={30} /> : <CheckCircle2 size={30} />}
        </div>
        <h2 className="mt-4 text-2xl font-black">{isError ? "Gagal" : "Berhasil"}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-ink/65">{error || success}</p>
        <button className={isError ? "btn-danger mt-5 w-full justify-center" : "btn-primary mt-5 w-full justify-center"} type="button" onClick={() => setOpen(false)}>
          {isError ? "Coba Lagi" : "Oke"}
        </button>
      </div>
    </div>
  );
}
