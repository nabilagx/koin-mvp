import { redirect } from "next/navigation";

export function actionMessage(path: string, type: "success" | "error", message: string): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
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
