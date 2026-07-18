import { WEIGHTS } from "../../lib/firms";

export const metadata = {
  title: "How Trust Scores Work — PayoutRadar",
  description: "The methodology behind PayoutRadar prop firm trust scores.",
};

export default function Methodology() {
  return (
    <main className="wrap section">
      <div className="eyebrow">Methodology</div>
      <h1>How the Trust Score works</h1>
      <p className="muted" style={{ maxWidth: "42em" }}>
        Star ratings tell you how a firm markets itself. The Trust Score tells you how a firm
        behaves. Every firm on the radar is scored on three dimensions, weighted by what actually
        matters to a funded trader:
      </p>

      <div className="grid-3" style={{ margin: "28px 0" }}>
        <div className="card">
          <div className="eyebrow">{Math.round(WEIGHTS.payoutReliability * 100)}% weight</div>
          <h3>Payout reliability</h3>
          <p className="muted">
            Do payouts arrive on time, at the advertised split, without surprise deductions or
            last-minute rule invocations? Fed by payout history and, soon, community payout proof.
          </p>
        </div>
        <div className="card">
          <div className="eyebrow">{Math.round(WEIGHTS.disputeHandling * 100)}% weight</div>
          <h3>Dispute handling</h3>
          <p className="muted">
            The dimension nobody else measures. When accounts get flagged, payouts get denied, or
            rules get &quot;interpreted&quot; — does the firm explain, engage, and resolve fairly? Or does
            it hide behind vague terms?
          </p>
        </div>
        <div className="card">
          <div className="eyebrow">{Math.round(WEIGHTS.ruleTransparency * 100)}% weight</div>
          <h3>Rule transparency</h3>
          <p className="muted">
            Are drawdown mechanics, consistency rules, and prohibited strategies documented
            clearly and kept stable? Frequent silent rule changes cost points.
          </p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <h3>The formula</h3>
        <p className="mono accent" style={{ fontSize: "0.95rem" }}>
          Trust = Payout×{WEIGHTS.payoutReliability} + Disputes×{WEIGHTS.disputeHandling} + Rules×{WEIGHTS.ruleTransparency}
        </p>
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          Each dimension is scored 0–10. Today, scores are editorial assessments based on firm
          track records, public payout history, documented rule changes, and trader reports. As the
          community launches, verified payout proof and structured reviews will update scores
          dynamically — every verified report nudges the radar.
        </p>
      </div>

      <p className="notice" style={{ marginTop: 24, maxWidth: 640 }}>
        Independence: firms cannot pay for a better score. Affiliate partnerships never enter the
        formula — a firm with a great commission and a bad payout record still gets a bad score.
      </p>
    </main>
  );
}
