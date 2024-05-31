import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './ComicList.css'; // Import the CSS file for styles
import comics from '../../comics_all_marvel_human_readable.json';



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

const ComicList = () => {
  const [expandedComic, setExpandedComic] = useState(null);
  const contentRefs = useRef([]);


  const toggleExpand = (index) => {
    setExpandedComic(expandedComic === index ? null : index);
  };

  const totalCost = comics.reduce((total, comic) => {
    return total + (comic['PURCHASE STATUS'] === 'Purchased' && comic.COST ? parseFloat(comic.COST) : 0);
}, 0);

 // Calculate the total pages
 const totalPages = comics.reduce((total, comic) => {
  return total + (comic.PAGES ? parseInt(comic.PAGES) : 0);
}, 0);

// Calculate the average rating
// Calculate the average rating
const ratings = comics.filter(comic => comic.RATING != null).map(comic => parseFloat(comic.RATING));
const averageRating = ratings.length ? (ratings.reduce((total, rating) => total + rating, 0) / ratings.length).toFixed(1) : 'N/A';


  return (
    <div className="comic-list">
      <table>
        <thead style={{ color: '#292D38'}}>
          <tr>
            <th style={{ width: '35%', color: '#D8DBE2'}}>Title</th>
            <th style={{ width: '10%', color: '#D8DBE2' }}>Purchase Status</th>
            <th style={{ width: '5%', color: '#D8DBE2' }}>Cost</th>
            <th style={{ width: '15%', color: '#D8DBE2' }}>Hardcover Status</th>
            <th style={{ width: '5%', color: '#D8DBE2' }}>Pages</th>
            <th style={{ width: '5%', color: '#D8DBE2' }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          <TransitionGroup component={null}>
            {comics.map((comic, index) => (
              <React.Fragment key={index}>
                <tr className={comic.DIVIDER ? 'divider-row' : comic.EVENT ? 'event-row' : ''} onClick={() => toggleExpand(index)}>
                  <td className={comic.EVENT ? 'bold-title' : 'title'}>
                              <span>{comic.TITLE}</span>
                              {comic.EVENT && <span className="event-badge">{comic['EVENT TYPE']}</span>}
                  </td>
                  <td className={getStatusClass(comic["PURCHASE STATUS"])}>{comic["PURCHASE STATUS"]}</td>
                  <td >{comic.COST ? `$${comic.COST}` : ''}</td> 
                  <td className={getHardcoverClass(comic["HARDCOVER?"])}></td>
                  <td>{comic.PAGES}</td>
                  <td><strong>{comic.RATING}</strong></td>
                </tr>
                <CSSTransition
                  in={expandedComic === index}
                  timeout={500}
                  classNames="details"
                  unmountOnExit
                >
                  <tr className={`details-row`}>
                    <td colSpan="6">
                    <div className={`details-content ${expandedComic === index ? 'details-content-expanded' : ''}`}>
                        <img className="cover-art" src={comic["COVER ART"] || "/images/defaultcover.webp"} alt={`${comic.TITLE} cover art`} loading='lazy' />
                        <div className="details-text">
                        <h3>
                            {comic.TITLE}
                            {comic.LINK && <a href={comic.LINK} target="_blank" rel="noopener noreferrer" className="buy-button">Buy on Amazon</a>}
                          </h3>
                          <p>{comic.DESCRIPTION}</p>
                          <p><strong>Key Characters:</strong> {comic["KEY CHARACTERS"].join(', ')}</p>
                          <p><strong>Release Date:</strong> {comic["RELEASE DATE"]}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </CSSTransition>
              </React.Fragment>
            ))}
          </TransitionGroup>
          <tr className="total-row">
                    <td colSpan="6" className="total-label">
                        TOTAL SPENT: ${totalCost.toFixed(2)} | TOTAL PAGES: {totalPages} | AVG RATING: {averageRating}/5
                    </td>
                </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComicList;
