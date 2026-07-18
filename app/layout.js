import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "PayoutRadar — Which prop firms actually pay?",
  description:
    "Compare prop trading firms by real payout reliability, rule transparency, and dispute handling. Trust scores, discounts, and community payout proof.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="logo">
              <span className="logo-mark" aria-hidden="true" />
              PayoutRadar
            </Link>
            <nav className="nav" aria-label="Main">
              <Link href="/#firms">Firms</Link>
              <Link href="/offers">Offers</Link>
              <Link href="/methodology">Trust Score</Link>
              <Link href="/community">Community</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="wrap">
            <div className="cols">
              <div>
                <div className="logo" style={{ marginBottom: 12 }}>
                  <span className="logo-mark" aria-hidden="true" />
                  PayoutRadar
                </div>
                <p>
                  Independent prop firm comparison built by traders, for traders. We track who
                  actually pays out — and how firms treat you when things go wrong.
                </p>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text)" }}>Explore</p>
                <p><Link href="/#firms">Compare firms</Link></p>
                <p><Link href="/offers">Discount codes</Link></p>
                <p><Link href="/methodology">How trust scores work</Link></p>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text)" }}>Community</p>
                <p><Link href="/community">Payout proof feed</Link></p>
                <p><Link href="/community">Reviews</Link></p>
              </div>
            </div>
            <div className="legal">
              <p>
                Affiliate disclosure: PayoutRadar earns a commission when you purchase through
                links or codes on this site, at no extra cost to you — it usually gets you a
                discount. This never affects trust scores, which are calculated independently.
              </p>
              <p>
                Trading futures, forex, and CFDs involves substantial risk of loss and is not
                suitable for everyone. Nothing on this site is financial advice.
              </p>
              <p>© {new Date().getFullYear()} PayoutRadar. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
