"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFirm, updateFirm, deleteFirm, uploadFirmLogo, signOut } from "./actions";

const FIELDS = [
  ["slug", "Slug (url, unique, no spaces)", "text"],
  ["name", "Name", "text"],
  ["markets", "Markets (comma-separated: futures, forex, cfd)", "text"],
  ["country", "Country code (e.g. US)", "text"],
  ["founded", "Founded year", "number"],
  ["priceFrom", "Price from ($)", "number"],
  ["maxAllocation", "Max allocation", "text"],
  ["payoutSplit", "Payout split", "text"],
  ["payoutFrequency", "Payout frequency", "text"],
  ["drawdownType", "Drawdown type", "text"],
  ["consistencyRule", "Consistency rule", "text"],
  ["minTradingDays", "Min. trading days", "number"],
  ["platforms", "Platforms (comma-separated)", "text"],
  ["promoDiscount", "Promo discount", "text"],
  ["promoCode", "Promo code", "text"],
  ["affiliateUrl", "Affiliate URL", "text"],
  ["scorePayoutReliability", "Score: Payout reliability (0-10)", "number"],
  ["scoreRuleTransparency", "Score: Rule transparency (0-10)", "number"],
  ["scoreDisputeHandling", "Score: Dispute handling (0-10)", "number"],
  ["sortOrder", "Sort order (lower = first)", "number"],
];

function firmToDefaults(f) {
  if (!f) return { slug: "", name: "" };
  return {
    slug: f.slug,
    name: f.name,
    markets: (f.markets || []).join(", "),
    country: f.country || "",
    founded: f.founded ?? "",
    priceFrom: f.priceFrom ?? "",
    maxAllocation: f.maxAllocation || "",
    payoutSplit: f.payoutSplit || "",
    payoutFrequency: f.payoutFrequency || "",
    drawdownType: f.drawdownType || "",
    consistencyRule: f.consistencyRule || "",
    minTradingDays: f.minTradingDays ?? "",
    platforms: (f.platforms || []).join(", "),
    promoDiscount: f.promo?.discount || "",
    promoCode: f.promo?.code || "",
    affiliateUrl: f.affiliateUrl || "#",
    scorePayoutReliability: f.scores?.payoutReliability ?? "",
    scoreRuleTransparency: f.scores?.ruleTransparency ?? "",
    scoreDisputeHandling: f.scores?.disputeHandling ?? "",
    blurb: f.blurb || "",
    sortOrder: 0,
  };
}

function FirmForm({ firm, onDone }) {
  const isEdit = Boolean(firm);
  const defaults = firmToDefaults(firm);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);
    startTransition(async () => {
      const res = isEdit
        ? await updateFirm(firm.slug, formData)
        : await createFirm(formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: "grid", gap: 10, padding: 20, marginTop: 12 }}>
      {FIELDS.map(([key, label, type]) => (
        <label key={key} style={{ display: "grid", gap: 4 }}>
          <span className="firm-sub">{label}</span>
          <input
            name={key}
            type={type}
            step={type === "number" ? "0.1" : undefined}
            defaultValue={defaults[key]}
            required={key === "slug" || key === "name"}
          />
        </label>
      ))}
      <label style={{ display: "grid", gap: 4 }}>
        <span className="firm-sub">Blurb</span>
        <textarea name="blurb" rows={3} defaultValue={defaults.blurb} />
      </label>
      {error && <p style={{ color: "var(--red)", fontSize: "0.85rem" }}>{error}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" className="btn primary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create firm"}
        </button>
        <button type="button" className="btn" onClick={onDone} disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function LogoUpload({ slug, currentUrl, onDone }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const formData = new FormData();
    formData.set("logo", file);
    startTransition(async () => {
      const res = await uploadFirmLogo(slug, formData);
      if (res.error) setError(res.error);
      else onDone();
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {currentUrl ? (
        <img src={currentUrl} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain", background: "#fff", border: "1px solid var(--line)" }} />
      ) : (
        <span className="firm-sub">No logo</span>
      )}
      <label className="btn small" style={{ cursor: "pointer" }}>
        {pending ? "Uploading…" : "Upload logo"}
        <input type="file" accept="image/*" onChange={handleChange} disabled={pending} style={{ display: "none" }} />
      </label>
      {error && <span style={{ color: "var(--red)", fontSize: "0.8rem" }}>{error}</span>}
    </div>
  );
}

export default function AdminDashboard({ firms, adminUsername }) {
  const [editingSlug, setEditingSlug] = useState(null);
  const [adding, setAdding] = useState(false);
  const [busySlug, setBusySlug] = useState(null);
  const router = useRouter();

  function refresh() {
    setEditingSlug(null);
    setAdding(false);
    router.refresh();
  }

  async function handleDelete(slug) {
    if (!confirm(`Delete ${slug}? This can't be undone.`)) return;
    setBusySlug(slug);
    await deleteFirm(slug);
    setBusySlug(null);
    router.refresh();
  }

  return (
    <main className="wrap section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="eyebrow">Admin</div>
          <h1 style={{ margin: 0 }}>Manage firms</h1>
          <p className="firm-sub">Signed in as {adminUsername}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn primary" onClick={() => { setAdding(true); setEditingSlug(null); }}>
            + Add firm
          </button>
          <button
            className="btn"
            onClick={() => startTransitionSignOut(router)}
          >
            Sign out
          </button>
        </div>
      </div>

      {adding && <FirmForm firm={null} onDone={refresh} />}

      <div style={{ marginTop: 24, display: "grid", gap: 10 }}>
        {firms.map((f) => (
          <div key={f.slug} className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {f.logoUrl ? (
                  <img src={f.logoUrl} alt="" className="firm-avatar-img" />
                ) : (
                  <span className="firm-avatar">{f.name[0]}</span>
                )}
                <div>
                  <div className="firm-name">{f.name}</div>
                  <div className="firm-sub">{f.slug} · trust {f.trust.toFixed(1)}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  className="btn small"
                  onClick={() => { setEditingSlug(editingSlug === f.slug ? null : f.slug); setAdding(false); }}
                >
                  {editingSlug === f.slug ? "Close" : "Edit"}
                </button>
                <button
                  className="btn small"
                  onClick={() => handleDelete(f.slug)}
                  disabled={busySlug === f.slug}
                  style={{ color: "var(--red)" }}
                >
                  {busySlug === f.slug ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <LogoUpload slug={f.slug} currentUrl={f.logoUrl} onDone={refresh} />
            </div>

            {editingSlug === f.slug && <FirmForm firm={f} onDone={refresh} />}
          </div>
        ))}
      </div>
    </main>
  );
}

function startTransitionSignOut(router) {
  signOut().then(() => router.refresh());
}
