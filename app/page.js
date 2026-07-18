import Link from "next/link";
import { getFirms } from "../lib/firms";
import FirmTable from "../components/FirmTable";

export default function Home() {
  const firms = getFirms();
  const avg = (firms.reduce((s, f) => s + f.trust, 0) / firms.length).toFixed(1);

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div>
            <div className="eyebrow">Prop firm intelligence</div>
            <h1>
              Which prop firms <span className="accent">actually pay out?</span>
            </h1>
            <p className="lead">
              Marketing says everyone pays. The radar tracks what really happens: payout
              reliability, rule transparency, and how firms treat traders when things go wrong —
              plus the best discount on every evaluation.
            </p>
            <div className="hero-cta">
              <a href="#firms" className="btn primary">
                Compare firms
              </a>
              <Link href="/methodology" className="btn">
                How trust scores work
              </Link>
            </div>
          </div>
          <div className="radar-visual" aria-hidden="true">
            <div className="radar-ring" style={{ inset: "0%" }} />
            <div className="radar-ring" style={{ inset: "18%" }} />
            <div className="radar-ring" style={{ inset: "36%" }} />
            <div className="radar-sweep" />
            <div className="radar-blip" style={{ top: "24%", left: "62%" }} />
            <div className="radar-blip" style={{ top: "58%", left: "30%", opacity: 0.7 }} />
            <div className="radar-blip" style={{ top: "70%", left: "68%", opacity: 0.5 }} />
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="stats">
          <div>
            <div className="num mono">{firms.length}</div>
            <div className="lbl">Firms on the radar</div>
          </div>
          <div>
            <div className="num mono">3</div>
            <div className="lbl">Trust dimensions per firm</div>
          </div>
          <div>
            <div className="num mono">{avg}</div>
            <div className="lbl">Average trust score</div>
          </div>
        </div>
      </div>

      <section className="section" id="firms">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Live comparison</div>
              <h2>Firms on the radar</h2>
            </div>
            <Link href="/methodology" className="muted" style={{ fontSize: "0.9rem" }}>
              What do these scores mean? →
            </Link>
          </div>
          <FirmTable firms={firms} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Why PayoutRadar</div>
          <h2>Built around the questions that matter</h2>
          <div className="grid-3" style={{ marginTop: 20 }}>
            <div className="card">
              <h3 className="accent">Payout reliability</h3>
              <p className="muted">
                Does the firm pay, on time, at the advertised split? We weight this highest —
                because a 90% split means nothing if the payout never arrives.
              </p>
            </div>
            <div className="card">
              <h3 className="accent">Rule transparency</h3>
              <p className="muted">
                Trailing vs end-of-day drawdown, consistency rules, prohibited strategies. Clear
                rules protect traders; vague rules protect firms.
              </p>
            </div>
            <div className="card">
              <h3 className="accent">Dispute handling</h3>
              <p className="muted">
                The score nobody else tracks: what happens when your payout is denied or your
                account is flagged? How a firm behaves in conflict tells you everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ maxWidth: "34em" }}>
              <div className="eyebrow">Coming soon</div>
              <h2 style={{ marginBottom: 8 }}>The payout proof feed</h2>
              <p className="muted" style={{ margin: 0 }}>
                Real traders posting real payout proof — screenshots, amounts, and dates that feed
                directly into each firm&apos;s trust score. No marketing, just receipts.
              </p>
            </div>
            <Link href="/community" className="btn amber">
              Preview the community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
