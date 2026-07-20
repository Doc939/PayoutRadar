import { createStaticClient } from "./supabase/static";
import { shapeFirm } from "./firms";

export async function getFirms() {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("firms")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getFirms error:", error.message);
    return [];
  }
  return data.map(shapeFirm).sort((a, b) => b.trust - a.trust);
}

export async function getFirm(slug) {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("firms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return shapeFirm(data);
}
