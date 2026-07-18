import firmsData from "../data/firms.json";

// Trust Score engine — weights favor what traders care about most:
// getting paid, knowing the rules, and being treated fairly when things go wrong.
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

export function getFirms() {
  return firmsData
    .map((f) => ({ ...f, trust: trustScore(f.scores) }))
    .sort((a, b) => b.trust - a.trust);
}

export function getFirm(slug) {
  const f = firmsData.find((x) => x.slug === slug);
  if (!f) return null;
  return { ...f, trust: trustScore(f.scores) };
}
