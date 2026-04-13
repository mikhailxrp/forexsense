const IMPACT_TO_CLASS = {
  High: 'badge impact-high',
  Medium: 'badge impact-medium',
  Low: 'badge impact-low',
};

export default function ImpactBadge({ impact }) {
  const className = IMPACT_TO_CLASS[impact] ?? IMPACT_TO_CLASS.Low;
  return <span className={className}>{impact}</span>;
}
