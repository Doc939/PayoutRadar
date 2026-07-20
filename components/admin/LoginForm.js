"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <main className="wrap section" style={{ maxWidth: 420 }}>
      <div className="eyebrow">Admin</div>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} className="card" style={{ display: "grid", gap: 12, padding: 24 }}>
        <label style={{ display: "grid", gap: 4 }}>
          <span className="firm-sub">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          <span className="firm-sub">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && <p style={{ color: "var(--red)", fontSize: "0.85rem" }}>{error}</p>}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
