"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function ReturnToInput() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cleanParams = new URLSearchParams(searchParams.toString());
  cleanParams.delete("success");
  cleanParams.delete("error");
  cleanParams.delete("flash");
  const query = cleanParams.toString();
  return <input type="hidden" name="return_to" value={`${pathname}${query ? `?${query}` : ""}`} />;
}
