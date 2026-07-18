// Triangle radar chart: the PayoutRadar signature.
// Axes: Payout Reliability (top), Rule Transparency (bottom-left), Dispute Handling (bottom-right)
export default function TrustRadar({ scores, size = 44, detailed = false }) {
  const c = size / 2;
  const R = c - (detailed ? 18 : 4);

  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / 3;
  const pt = (i, r) => [c + r * Math.cos(angle(i)), c + r * Math.sin(angle(i))];

  const vals = [scores.payoutReliability, scores.ruleTransparency, scores.disputeHandling];
  const poly = vals.map((v, i) => pt(i, (v / 10) * R).join(",")).join(" ");
  const outer = [0, 1, 2].map((i) => pt(i, R).join(",")).join(" ");
  const mid = [0, 1, 2].map((i) => pt(i, R / 2).join(",")).join(" ");

  const labels = ["Payout", "Rules", "Disputes"];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Trust radar: payout ${vals[0]}, rules ${vals[1]}, disputes ${vals[2]} out of 10`}
    >
      <polygon points={outer} fill="none" stroke="var(--line)" strokeWidth="1" />
      <polygon points={mid} fill="none" stroke="var(--line)" strokeWidth="1" />
      <polygon points={poly} fill="rgba(63,216,194,0.25)" stroke="var(--radar)" strokeWidth="1.5" />
      {detailed &&
        [0, 1, 2].map((i) => {
          const [x, y] = pt(i, R + 12);
          return (
            <text
              key={i}
              x={x}
              y={y + (i === 0 ? -2 : 6)}
              textAnchor="middle"
              fontSize="9"
              fill="var(--muted)"
              fontFamily="IBM Plex Mono, monospace"
            >
              {labels[i]}
            </text>
          );
        })}
    </svg>
  );
}
