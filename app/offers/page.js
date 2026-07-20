import Link from "next/link";
import { getFirms } from "../../lib/firms-data";
import { trustLabel } from "../../lib/firms";

export const metadata = {
  title: "Prop Firm Discount Codes — PayoutRadar",
  description: "Current verified discount codes for futures and forex prop firms.",
};

export const revalidate = 60;

export default async function Offers() {
  const firms = await getFirms();
  return (
    <main className="wrap section">
      <div className="eyebrow">Verified offers</div>
      <h1>Current discount codes</h1>
      <p className="muted" style={{ maxWidth: "40em" }}>
        Every code below is checked regularly. Using them supports PayoutRadar at no extra cost —
        and never influences a firm&apos;s trust score.
      </p>
      <div className="grid-3" style={{ marginTop: 24 }}>
        {firms.map((f) => {
          const t = trustLabel(f.trust);
          return (
            <div className="card" key={f.slug}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{f.name}</h3>
                <span className={`trust-num tone-${t.tone}`}>{f.trust.toFixed(1)}</span>
              </div>
              <p className="promo-pill" style={{ margin: "12px 0" }}>{f.promo.discount}</p>
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                Code: <span className="promo-code" style={{ fontSize: "1rem" }}>{f.promo.code}</span>
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={f.affiliateUrl} className="btn small amber" rel="sponsored noopener" target="_blank">
                  Claim offer
                </a>
                <Link href={`/firms/${f.slug}`} className="btn small">
                  Trust report
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
