const SENTIMENT_TO_CLASS = {
  bullish: 'badge bg-success',
  bearish: 'badge bg-danger',
  neutral: 'badge bg-secondary',
  Bullish: 'badge bg-success',
  Bearish: 'badge bg-danger',
  Neutral: 'badge bg-secondary'
};

function normalizeSentiment(sentiment) {
  if (sentiment === null || sentiment === undefined || sentiment === '') {
    return { key: 'neutral', label: 'Neutral' };
  }
  const raw = String(sentiment);
  const key = raw.toLowerCase();
  const label = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return { key, label };
}

export default function SentimentBadge({ sentiment }) {
  const { key, label } = normalizeSentiment(sentiment);
  const className =
    SENTIMENT_TO_CLASS[key] ?? SENTIMENT_TO_CLASS[label] ?? SENTIMENT_TO_CLASS.neutral;
  return <span className={className}>{label}</span>;
}
