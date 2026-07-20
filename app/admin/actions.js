"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// All writes rely on Postgres RLS (only role='admin' can insert/update/delete),
// so even if this action were called by a non-admin, the database rejects it.

function parseFirmFields(formData) {
  const num = (v) => (v === "" || v == null ? null : Number(v));
  const csv = (v) =>
    (v || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  return {
    slug: formData.get("slug")?.trim(),
    name: formData.get("name")?.trim(),
    markets: csv(formData.get("markets")),
    country: formData.get("country")?.trim() || null,
    founded: num(formData.get("founded")),
    price_from: num(formData.get("priceFrom")),
    max_allocation: formData.get("maxAllocation")?.trim() || null,
    payout_split: formData.get("payoutSplit")?.trim() || null,
    payout_frequency: formData.get("payoutFrequency")?.trim() || null,
    drawdown_type: formData.get("drawdownType")?.trim() || null,
    consistency_rule: formData.get("consistencyRule")?.trim() || null,
    min_trading_days: num(formData.get("minTradingDays")),
    platforms: csv(formData.get("platforms")),
    promo_discount: formData.get("promoDiscount")?.trim() || null,
    promo_code: formData.get("promoCode")?.trim() || null,
    affiliate_url: formData.get("affiliateUrl")?.trim() || "#",
    score_payout_reliability: num(formData.get("scorePayoutReliability")),
    score_rule_transparency: num(formData.get("scoreRuleTransparency")),
    score_dispute_handling: num(formData.get("scoreDisputeHandling")),
    blurb: formData.get("blurb")?.trim() || null,
    sort_order: num(formData.get("sortOrder")) ?? 0,
  };
}

export async function createFirm(formData) {
  const supabase = await createClient();
  const fields = parseFirmFields(formData);

  if (!fields.slug || !fields.name) {
    return { error: "Slug and name are required." };
  }

  const { error } = await supabase.from("firms").insert(fields);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/offers");
  return { success: true };
}

export async function updateFirm(originalSlug, formData) {
  const supabase = await createClient();
  const fields = parseFirmFields(formData);

  const { error } = await supabase.from("firms").update(fields).eq("slug", originalSlug);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/offers");
  revalidatePath(`/firms/${originalSlug}`);
  if (fields.slug !== originalSlug) revalidatePath(`/firms/${fields.slug}`);
  return { success: true };
}

export async function deleteFirm(slug) {
  const supabase = await createClient();
  const { error } = await supabase.from("firms").delete().eq("slug", slug);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/offers");
  return { success: true };
}

export async function uploadFirmLogo(slug, formData) {
  const supabase = await createClient();
  const file = formData.get("logo");
  if (!file || file.size === 0) return { error: "No file provided." };

  const ext = file.name.split(".").pop();
  const path = `${slug}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("firm-logos")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (uploadError) return { error: uploadError.message };

  const { data } = supabase.storage.from("firm-logos").getPublicUrl(path);
  const logoUrl = `${data.publicUrl}?t=${Date.now()}`; // cache-bust on re-upload

  const { error: updateError } = await supabase
    .from("firms")
    .update({ logo_url: logoUrl })
    .eq("slug", slug);
  if (updateError) return { error: updateError.message };

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/offers");
  revalidatePath(`/firms/${slug}`);
  return { success: true, logoUrl };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
}
