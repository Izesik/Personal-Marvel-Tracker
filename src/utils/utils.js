import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fullStar, faStarHalfAlt as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

export const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

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

export const getStatusBar = (status, type) => {
    const className = {
        default: 'status-bar',
        dialog: 'status-bar-dialog',
        event: 'status-bar-event'
    }[type] || 'status-bar';

    const classNames = `${className} ${status.toLowerCase().replace(' ', '-')}`;

    if (status === "Purchased") return <div className={classNames}>Purchased</div>;
    if (status === "Pre-Ordered") return <div className={classNames}>Pre-Ordered</div>;
    return null;
};
