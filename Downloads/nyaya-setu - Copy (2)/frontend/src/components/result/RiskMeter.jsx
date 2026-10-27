export default function RiskMeter({ score = 0 }) {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));
  return <div role="meter" aria-label="Risk score" aria-valuemin="0" aria-valuemax="100" aria-valuenow={safeScore}>Risk score: {safeScore}/100</div>;
}
