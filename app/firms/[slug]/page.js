import Link from "next/link";
import { notFound } from "next/navigation";
import { getFirm, getFirms, trustLabel } from "../../../lib/firms";
import TrustRadar from "../../../components/TrustRadar";

export function generateStaticParams() {
  return getFirms().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) return {};
  return {
    title: `${firm.name} Trust Score & Discount Code — PayoutRadar`,
    description: `${firm.name} rules, payout terms, trust score (${firm.trust}/10) and the best current discount code.`,
  };
}

const SUBS = [
  ["payoutReliability", "Payout reliability", "Do payouts arrive, on time, at the promised split?"],
  ["ruleTransparency", "Rule transparency", "Are drawdown, consistency and prohibited-strategy rules clear and stable?"],
  ["disputeHandling", "Dispute handling", "How does the firm treat traders in conflicts, flags and denied payouts?"],
];

export default async function FirmPage({ params }) {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) notFound();
  const t = trustLabel(firm.trust);

  return (
    <main className="wrap">
      <div className="detail-head">
        <div>
          <div className="eyebrow">
            <Link href="/#firms">← All firms</Link>
          </div>
          <h1>{firm.name}</h1>
          <p className="muted" style={{ maxWidth: "40em" }}>{firm.blurb}</p>
          <p>
            {firm.markets.map((m) => (
              <span key={m} className="tag">{m}</span>
            ))}
            <span className="tag">{firm.country}</span>
            <span className="tag">since {firm.founded}</span>
          </p>
        </div>

        <div className="card" style={{ minWidth: 260, textAlign: "center" }}>
          <div className="eyebrow">Trust Score</div>
          <div className={`trust-num tone-${t.tone}`} style={{ fontSize: "2.6rem" }}>
            {firm.trust.toFixed(1)}
          </div>
          <div className="muted" style={{ marginBottom: 12 }}>{t.label} · out of 10</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TrustRadar scores={firm.scores} size={150} detailed />
          </div>
        </div>
      </div>

      <div className="promo-box">
        <div>
          <div className="eyebrow" style={{ color: "var(--amber)" }}>Current offer</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{firm.promo.discount}</div>
          <div className="muted" style={{ fontSize: "0.85rem" }}>
            Use code <span className="promo-code">{firm.promo.code}</span> at checkout
          </div>
        </div>
        <a href={firm.affiliateUrl} className="btn amber" rel="sponsored noopener" target="_blank">
          Claim discount at {firm.name} →
        </a>
      </div>

      <section className="section" style={{ paddingTop: 24 }}>
        <h2>Trust breakdown</h2>
        <div className="card" style={{ maxWidth: 640 }}>
          {SUBS.map(([key, label, desc]) => (
            <div className="subscore" key={key}>
              <div className="row">
                <span>{label}</span>
                <span className="mono accent">{firm.scores[key].toFixed(1)}</span>
              </div>
              <div className="bar">
                <i style={{ width: `${firm.scores[key] * 10}%` }} />
              </div>
              <div className="muted" style={{ fontSize: "0.8rem", marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <h2>Key facts &amp; rules</h2>
        <div className="facts">
          <div><div className="k">Price from</div><div className="v mono">${firm.priceFrom}</div></div>
          <div><div className="k">Max allocation</div><div className="v mono">{firm.maxAllocation}</div></div>
          <div><div className="k">Profit split</div><div className="v mono">{firm.payoutSplit}</div></div>
          <div><div className="k">Payout frequency</div><div className="v">{firm.payoutFrequency}</div></div>
          <div><div className="k">Drawdown type</div><div className="v">{firm.drawdownType}</div></div>
          <div><div className="k">Consistency rule</div><div className="v">{firm.consistencyRule}</div></div>
          <div><div className="k">Min. trading days</div><div className="v mono">{firm.minTradingDays}</div></div>
          <div><div className="k">Platforms</div><div className="v">{firm.platforms.join(", ")}</div></div>
        </div>
        <p className="notice" style={{ marginTop: 16 }}>
          Firm rules change frequently. Always verify current terms on the firm&apos;s official
          site before purchasing an evaluation. Spotted outdated data?{" "}
          <Link href="/community" className="accent">Report it</Link> — corrections feed the trust score.
        </p>
      </section>
    </main>
  );
}
