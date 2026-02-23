import { TRPCError } from "@trpc/server";

export type UsageMode = "simple" | "exam" | "detailed";

type UsageBucket = {
  date: string;
  count: number;
};

type RateBucket = {
  timestamps: number[];
};

const DAILY_FREE_LIMIT = 10;
const RATE_LIMIT_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

const usageByActor = new Map<string, UsageBucket>();
const rateByActor = new Map<string, RateBucket>();

const todayKey = () => new Date().toISOString().slice(0, 10);

export function getActorKey(userId: number | null, ip: string | null): string {
  if (userId) return `user:${userId}`;
  return `ip:${ip ?? "unknown"}`;
}

export function checkRateLimit(actorKey: string): void {
  const now = Date.now();
  const bucket = rateByActor.get(actorKey) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts <= RATE_LIMIT_WINDOW_MS);

  if (bucket.timestamps.length >= RATE_LIMIT_REQUESTS) {
    rateByActor.set(actorKey, bucket);
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded. Please wait a minute before generating again.",
    });
  }

  bucket.timestamps.push(now);
  rateByActor.set(actorKey, bucket);
}

export function getUsage(actorKey: string) {
  const today = todayKey();
  const bucket = usageByActor.get(actorKey);
  const usedToday = bucket && bucket.date === today ? bucket.count : 0;

  return {
    usedToday,
    dailyLimit: DAILY_FREE_LIMIT,
    remainingToday: Math.max(DAILY_FREE_LIMIT - usedToday, 0),
  };
}

export function consumeDailyUsage(actorKey: string) {
  const today = todayKey();
  const bucket = usageByActor.get(actorKey);
  const currentCount = bucket && bucket.date === today ? bucket.count : 0;

  if (currentCount >= DAILY_FREE_LIMIT) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Daily limit reached (${DAILY_FREE_LIMIT}/${DAILY_FREE_LIMIT}). Try again tomorrow.`,
    });
  }

  const nextCount = currentCount + 1;
  usageByActor.set(actorKey, {
    date: today,
    count: nextCount,
  });

  return {
    usedToday: nextCount,
    dailyLimit: DAILY_FREE_LIMIT,
    remainingToday: Math.max(DAILY_FREE_LIMIT - nextCount, 0),
  };
}
