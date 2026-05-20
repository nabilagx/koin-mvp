import { createHash } from "crypto";

export function hashPin(pin: string) {
  const secret = process.env.PIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "koin-mvp-local";
  return createHash("sha256").update(`${pin}${secret}`).digest("hex");
}
