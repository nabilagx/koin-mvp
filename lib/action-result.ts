import { redirect } from "next/navigation";

export function appendActionMessage(path: string, type: "success" | "error", message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${type}=${encodeURIComponent(message)}`;
}

export function actionMessage(path: string, type: "success" | "error", message: string): never {
  redirect(appendActionMessage(path, type, message));
}

export function getReturnTo(formData: FormData, fallback: string) {
  const value = formData.get("return_to");
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("://")) return fallback;
  return value;
}

export function friendlyError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function rethrowRedirect(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  ) {
    throw error;
  }
}
