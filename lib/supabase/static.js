import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Used for public, non-user-specific reads (firm data) that need to work
// during static generation, where there's no request/cookie context available.
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
