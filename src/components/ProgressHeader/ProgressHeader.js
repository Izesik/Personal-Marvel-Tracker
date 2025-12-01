import React from "react";
import "./ProgressHeader.css";

const ProgressHeader = ({
  purchasedComics = 24,
  totalComics = 42,
  totalCost = 347.5,
  totalPages = 1248,
  averageRating = 4.2,
  title = "COLLECTION OVERVIEW",
}) => {
  // Sanitize numeric values
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
          className={`star ${
            isFilled ? "filled" : isHalf ? "half-filled" : "empty"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {isHalf && (
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#374151" />
              </linearGradient>
            </defs>
          )}
          <path
            fill={isHalf ? `url(#half-${i})` : "currentColor"}
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
          <span className="stat-icon">📚</span>
          <span className="stat-text">
            <strong>{purchased}</strong> / {total} Comics
          </span>
        </div>

        <div className="progress-stat">
          <span className="stat-icon">💰</span>
          <span className="stat-text">
            <strong>${cost.toFixed(2)}</strong>
          </span>
        </div>

        <div className="progress-stat">
          <span className="stat-icon">📖</span>
          <span className="stat-text">
            <strong>{pages.toLocaleString()}</strong> Pages
          </span>
        </div>

        <div className="progress-stat">
          <div className="rating-container">
            <div className="rating-stars">{renderStars(rating)}</div>
            <span className="rating-value">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
