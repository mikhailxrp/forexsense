const LEVELS = [1, 2, 3, 4, 5];

const LARGE_DOT_STYLE = { width: '16px', height: '16px' };

export default function SignalStrength({ value, large = false }) {
  const dotStyle = large ? LARGE_DOT_STYLE : undefined;
  return (
    <div className={`signal-strength${large ? ' justify-content-center mb-3' : ''}`}>
      {LEVELS.map((level) => (
        <div
          key={level}
          className={level <= value ? 'signal-dot filled' : 'signal-dot'}
          style={dotStyle}
        />
      ))}
    </div>
  );
}
