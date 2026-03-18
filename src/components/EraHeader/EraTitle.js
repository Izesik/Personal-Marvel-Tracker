import "./EraTitle.css";

const EraTitle = ({
  era = "MODERN AGE",
  purchasedComics = 24,
  totalComics = 42,
  totalCost = 347.5,
  totalPages = 1248,
  averageRating = 4.2,
}) => {
  const numericRating = parseFloat(averageRating);
  const hasRating = !isNaN(numericRating) && numericRating > 0;

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
              <linearGradient id={`era-half-${i}`}>
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#374151" />
              </linearGradient>
            </defs>
          )}
          <path
            fill={isHalf ? `url(#era-half-${i})` : "currentColor"}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      );
    });
  };

  return (
    <div className="era-title">
      <div className="era-name">{era.toUpperCase()}</div>

      <div className="era-stats">
        <div className="stat-item">
          <span className="stat-number">
            <strong>{purchasedComics}</strong>
            <span className="stat-fraction"> / {totalComics}</span>
          </span>
          <span className="stat-label">COMICS</span>
        </div>

        <div className="stat-item">
          <span className="stat-number">
            <strong>${totalCost.toFixed(2)}</strong>
          </span>
          <span className="stat-label">SPENT</span>
        </div>

        <div className="stat-item">
          <span className="stat-number">
            <strong>{totalPages.toLocaleString()}</strong>
          </span>
          <span className="stat-label">PAGES</span>
        </div>

        <div className="stat-item">
          <span className="stat-number rating-inline">
            {hasRating ? renderStars(numericRating) : null}
            <strong>{hasRating ? numericRating.toFixed(1) : "—"}</strong>
          </span>
          <span className="stat-label">AVG RATING</span>
        </div>
      </div>
    </div>
  );
};

export default EraTitle;
