import { createAdminClient } from "./supabase/admin";

export type DailyLimitUsage = {
  daily_limit: number;
  spent_today: number;
  saved_today: number;
  remaining_today: number;
};

export async function getDailyLimitUsage(admin: ReturnType<typeof createAdminClient>, child_id: string, daily_limit: number | string): Promise<DailyLimitUsage> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [{ data: transactions }, { data: movements }] = await Promise.all([
    admin
      .from("transactions")
      .select("amount")
      .eq("child_id", child_id)
      .eq("status", "success")
      .gte("created_at", today.toISOString()),
    admin
      .from("saving_movements")
      .select("amount")
      .eq("child_id", child_id)
      .eq("type", "deposit")
      .gte("created_at", today.toISOString())
  ]);

  const spent_today = (transactions ?? []).reduce((total, item) => total + Number(item.amount), 0);
  const saved_today = (movements ?? []).reduce((total, item) => total + Number(item.amount), 0);
  const limit = Number(daily_limit ?? 0);

  return {
    daily_limit: limit,
    spent_today,
    saved_today,
    remaining_today: Math.max(limit - spent_today - saved_today, 0)
  };
}
