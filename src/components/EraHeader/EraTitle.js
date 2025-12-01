import React from "react";
import "./EraTitle.css";

const EraTitle = ({
  era = "MODERN AGE",
  purchasedComics = 24,
  totalComics = 42,
  totalCost = 347.5,
  totalPages = 1248,
  averageRating = 4.2,
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className="star filled"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="star half-filled"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <defs>
              <linearGradient id={`era-half-${i}`}>
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#374151" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#era-half-${i})`}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="star empty"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="era-title">
      <div className="era-name">{era.toUpperCase()}</div>
      <div className="era-stats">
        <div className="stat-item">
          <div className="stat-value">
            <strong>{purchasedComics}</strong> / {totalComics} Comics
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            <strong>${totalCost.toFixed(2)}</strong>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            <strong>{totalPages.toLocaleString()}</strong> Pages
          </div>
        </div>
        <div className="stat-item">
          <div className="rating">{renderStars(averageRating)}</div>
        </div>
      </div>
    </div>
  );
};

export default EraTitle;
