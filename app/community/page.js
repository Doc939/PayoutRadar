export const metadata = {
  title: "Community — PayoutRadar",
  description: "Payout proof, reviews and trader discussions. Launching soon.",
};

const PREVIEW = [
  { user: "NQ_Scalper", firm: "Topstep", amount: "$2,140", note: "3rd payout this month, hit my account in 2 days.", tag: "Payout proof" },
  { user: "FundedFadi", firm: "My Funded Futures", amount: "$4,800", note: "On-demand payout on Starter+, no issues.", tag: "Payout proof" },
  { user: "GoldDeskEU", firm: "Apex", amount: "—", note: "Account flagged after news trade — support went silent for 9 days.", tag: "Dispute report" },
];

export default function Community() {
  return (
    <main className="wrap section">
      <div className="eyebrow">Launching soon</div>
      <h1>Receipts, not reviews</h1>
      <p className="muted" style={{ maxWidth: "42em" }}>
        The community is where the radar gets its signal: traders posting payout proof, dispute
        reports, and honest firm reviews. Every verified report feeds directly into trust scores.
        Here&apos;s what the feed will look like:
      </p>

      <div className="grid-3" style={{ margin: "28px 0" }}>
        {PREVIEW.map((p, i) => (
          <div className="card" key={i} style={{ opacity: 0.9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="tag">{p.tag}</span>
              <span className="mono accent">{p.amount}</span>
            </div>
            <h3 style={{ margin: "12px 0 4px" }}>{p.firm}</h3>
            <p className="muted" style={{ fontSize: "0.9rem" }}>&quot;{p.note}&quot;</p>
            <p className="firm-sub">@{p.user} · preview</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <h3>What&apos;s coming</h3>
        <p className="muted" style={{ fontSize: "0.92rem" }}>
          Trader accounts and profiles · payout proof uploads with verification · structured firm
          reviews · dispute reports that affect dispute-handling scores · open discussion boards
          per firm. Built on the same trust-first principle: receipts beat marketing.
        </p>
      </div>
    </main>
  );
}
