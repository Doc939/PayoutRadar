// Trust Score engine — weights favor what traders care about most:
// getting paid, knowing the rules, and being treated fairly when things go wrong.
// This file has NO server-only imports so it can be safely used from client components.
export const WEIGHTS = {
  payoutReliability: 0.45,
  ruleTransparency: 0.25,
  disputeHandling: 0.3,
};

export function trustScore(scores) {
  const s =
    scores.payoutReliability * WEIGHTS.payoutReliability +
    scores.ruleTransparency * WEIGHTS.ruleTransparency +
    scores.disputeHandling * WEIGHTS.disputeHandling;
  return Math.round(s * 10) / 10;
}

export function trustLabel(score) {
  if (score >= 8) return { label: "Strong", tone: "good" };
  if (score >= 6.5) return { label: "Solid", tone: "ok" };
  if (score >= 5) return { label: "Mixed", tone: "warn" };
  return { label: "Caution", tone: "bad" };
}

// Maps a raw Supabase row (snake_case) to the shape the UI expects (camelCase).
export function shapeFirm(row) {
  const scores = {
    payoutReliability: Number(row.score_payout_reliability),
    ruleTransparency: Number(row.score_rule_transparency),
    disputeHandling: Number(row.score_dispute_handling),
  };
  return {
    slug: row.slug,
    name: row.name,
    logoUrl: row.logo_url,
    markets: row.markets || [],
    country: row.country,
    founded: row.founded,
    priceFrom: row.price_from,
    maxAllocation: row.max_allocation,
    payoutSplit: row.payout_split,
    payoutFrequency: row.payout_frequency,
    drawdownType: row.drawdown_type,
    consistencyRule: row.consistency_rule,
    minTradingDays: row.min_trading_days,
    platforms: row.platforms || [],
    promo: { discount: row.promo_discount, code: row.promo_code },
    affiliateUrl: row.affiliate_url,
    scores,
    blurb: row.blurb,
    trust: trustScore(scores),
  };
}
