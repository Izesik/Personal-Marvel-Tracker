import "./ProgressHeader.css";

const ProgressHeader = ({
  purchasedComics = 24,
  totalComics = 42,
  totalCost = 347.5,
  totalPages = 1248,
  averageRating = 4.2,
  title = "COLLECTION OVERVIEW",
}) => {
  const sanitize = (val, isInt = false) => {
    const num = isInt ? parseInt(val) : parseFloat(val);
    return isNaN(num) ? (isInt ? 0 : 0.0) : num;
  };

  const purchased = sanitize(purchasedComics, true);
  const total = Math.max(sanitize(totalComics, true), 1);
  const cost = sanitize(totalCost);
  const pages = sanitize(totalPages, true);
  const rating = Math.max(0, Math.min(5, sanitize(averageRating)));
  const progressValue = Math.round((purchased / total) * 100);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < fullStars;
      const isHalf = i === fullStars && hasHalf;

      return (
        <svg
          key={i}
          className={`star ${isFilled ? "filled" : isHalf ? "half-filled" : "empty"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {isHalf && (
            <defs>
              <linearGradient id={`ph-half-${i}`}>
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#374151" />
              </linearGradient>
            </defs>
          )}
          <path
            fill={isHalf ? `url(#ph-half-${i})` : "currentColor"}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      );
    });
  };

  return (
    <div className="progress-header">
      <div className="progress-title">{title}</div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar-container">
          <div
            className="progress-root"
            role="progressbar"
            aria-valuenow={progressValue}
          >
            <div
              className="progress-indicator"
              style={{ width: `${progressValue}%` }}
            />
            <div
              className="progress-glow"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <div className="progress-percentage">{progressValue}%</div>
        </div>
      </div>

      <div className="progress-stats">
        <div className="progress-stat primary">
          <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
          <span className="stat-number">
            <strong>{purchased}</strong>
            <span className="stat-fraction"> / {total}</span>
          </span>
          <span className="stat-label">COMICS</span>
        </div>

        <div className="progress-stat">
          <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          <span className="stat-number">
            <strong>${cost.toFixed(2)}</strong>
          </span>
          <span className="stat-label">SPENT</span>
        </div>

        <div className="progress-stat">
          <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className="stat-number">
            <strong>{pages.toLocaleString()}</strong>
          </span>
          <span className="stat-label">PAGES</span>
        </div>

        <div className="progress-stat">
          <div className="rating-stars">{renderStars(rating)}</div>
          <span className="stat-number">
            <strong>{rating.toFixed(1)}</strong>
            <span className="stat-fraction"> / 5</span>
          </span>
          <span className="stat-label">AVG RATING</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
