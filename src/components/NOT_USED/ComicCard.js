// ComicCard.js
import React from 'react';
import './ComicCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fullStar, faStarHalfAlt as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';


const ComicCard = ({ comic }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Purchased':
        return 'purchased';
      case 'Pre-Ordered':
        return 'pre-ordered';
      case 'Not Purchased':
        return 'not-purchased';
      default:
        return '';
    }
  };

  const getHardcoverClass = (status) => {
    switch (status) {
      case 'Hardcover':
        return 'hardcover';
      case 'Paperback':
        return 'paperback';
      default:
        return '';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
  
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={fullStar} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={halfStar} className="star half-filled" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={emptyStar} className="star" />);
      }
    }
    return stars;
  };

  return (
    <div className={`comic-card ${comic.EVENT ? 'event-card' : ''}`}>
      <div className="top-section">
        <div className="cover-art-container">
          <img className="comic-card-cover-art " src={comic["COVER ART"] || "/images/defaultcover.webp"} alt={`${comic.TITLE} cover art`} />
        </div>
        <div className="comic-details">
          <h3 className="comic-card-title">{comic.TITLE}</h3>
          <div className="star-rating">
          {comic.RATING != null && !comic.DIVIDER ? renderStars(comic.RATING) : !comic.DIVIDER ? <span>No Rating</span> : ''}
        </div>
          <div className="status">{comic["HARDCOVER?"]}</div>
          <div className={`purchase-status ${comic["PURCHASE STATUS"].toLowerCase().replace(' ', '-')}`}>
            {comic["PURCHASE STATUS"]}
          </div>
        </div>
      </div>
      <p className="comic-card-description">{comic.DESCRIPTION}</p>
      <div className="additional-details">
        <div className="cost">{comic.COST ? `$${comic.COST}` : ''}</div>
        {comic.LINK && (
          <a href={comic.LINK} className="comic-card-buy-button" target="_blank" rel="noopener noreferrer">
            Buy on Amazon
          </a>
        )}
      </div>
    </div>
  );
};

export default ComicCard;
