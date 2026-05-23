import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. " +
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (url, init) =>
      fetch(url, { ...init, signal: AbortSignal.timeout(10_000) }),
  },
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function queryWithRetry<T>(
  fn: () => PromiseLike<{ data: T | null; error: unknown }>,
  retries = 3
): Promise<{ data: T | null; error: unknown }> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await fn();
      if (!result.error) return result;
      lastError = result.error;
    } catch (err) {
      lastError = err;
    }

    if (attempt < retries - 1) {
      await sleep(Math.min(1000 * 2 ** attempt, 5000));
    }
  }

  console.error(`queryWithRetry failed after ${retries} retries:`, lastError);
  return { data: null, error: lastError };
}
