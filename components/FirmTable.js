"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import TrustRadar from "./TrustRadar";
import { trustLabel } from "../lib/firms";

const MARKETS = [
  { key: "all", label: "All markets" },
  { key: "futures", label: "Futures" },
  { key: "forex", label: "Forex / CFD" },
];

const SORTS = [
  { key: "trust", label: "Trust Score" },
  { key: "price", label: "Price (low → high)" },
  { key: "name", label: "Name (A–Z)" },
];

export default function FirmTable({ firms }) {
  const [market, setMarket] = useState("all");
  const [sort, setSort] = useState("trust");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    let r = firms.filter((f) => {
      const okMarket =
        market === "all" ||
        (market === "forex" ? f.markets.includes("forex") : f.markets.includes(market));
      const okQ = f.name.toLowerCase().includes(q.toLowerCase());
      return okMarket && okQ;
    });
    if (sort === "trust") r.sort((a, b) => b.trust - a.trust);
    if (sort === "price") r.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "name") r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [firms, market, sort, q]);

  return (
    <div>
      <div className="filterbar">
        {MARKETS.map((m) => (
          <button
            key={m.key}
            className={`chip ${market === m.key ? "on" : ""}`}
            onClick={() => setMarket(m.key)}
          >
            {m.label}
          </button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort firms">
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              Sort: {s.label}
            </option>
          ))}
        </select>
        <input
          placeholder="Search firms…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search firms"
        />
      </div>

      <div className="tablewrap">
        <table className="firms">
          <thead>
            <tr>
              <th>Firm</th>
              <th>Trust Score</th>
              <th>Markets</th>
              <th>From</th>
              <th>Max Alloc.</th>
              <th>Split</th>
              <th>Promo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => {
              const t = trustLabel(f.trust);
              return (
                <tr key={f.slug}>
                  <td>
                    <Link href={`/firms/${f.slug}`} className="firm-cell">
                      <span className="firm-avatar">{f.name[0]}</span>
                      <span>
                        <span className="firm-name">{f.name}</span>
                        <br />
                        <span className="firm-sub">
                          {f.country} · since {f.founded}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <div className="trust-cell">
                      <TrustRadar scores={f.scores} />
                      <span>
                        <span className={`trust-num tone-${t.tone}`}>{f.trust.toFixed(1)}</span>
                        <br />
                        <span className="firm-sub">{t.label}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    {f.markets.map((m) => (
                      <span key={m} className="tag">
                        {m}
                      </span>
                    ))}
                  </td>
                  <td className="mono">${f.priceFrom}</td>
                  <td className="mono">{f.maxAllocation}</td>
                  <td className="mono">{f.payoutSplit}</td>
                  <td>
                    <span className="promo-pill">{f.promo.discount}</span>
                  </td>
                  <td>
                    <Link href={`/firms/${f.slug}`} className="btn small primary">
                      Get discount
                    </Link>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="muted" style={{ textAlign: "center", padding: 32 }}>
                  No firms match your filters yet. Clear the search to see all tracked firms.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
