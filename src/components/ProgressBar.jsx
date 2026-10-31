/**
 * Полоса прогресса с подписью.
 *
 * @param {number} value Текущее значение.
 * @param {number} max Максимальное значение.
 */
export default function ProgressBar({ value, max, label, hint }) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));

  return (
    <div className="progress-bar">
      {label ? (
        <div className="progress-bar__header">
          <span className="progress-bar__label">{label}</span>
          <span className="progress-bar__value">
            {value} / {max}
          </span>
        </div>
      ) : null}

      <div
        className="progress-bar__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Прогресс'}
      >
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>

      {hint ? <p className="progress-bar__hint">{hint}</p> : null}
    </div>
  );
}
