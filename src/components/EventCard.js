import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './EventCard.css';
import './Modal.css';
import { renderStars, getStatusBar } from '../utils/utils';


const EventCardDesktop = ({ comic }) => {
    const purchaseStatusClass = comic["PURCHASE_STATUS"] ? `event-status-purchase ${comic["PURCHASE_STATUS"].toLowerCase().replace(' ', '-')}` : '';
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1300);
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 1300);
      };
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    const getStatusBar = (status) => {
        if (status === "Purchased") return <div className="status-bar-event purchased-mobile">Purchased</div>;
        if (status === "Pre-Ordered") return <div className="status-bar-event pre-ordered-mobile">Pre-Ordered</div>;
        if (status === "Ordered") return <div className="status-bar-event ordered-mobile">Ordered</div>;
        return null;
      };

    const purchaseStatus = comic["PURCHASE_STATUS"];

    return (
        <div className="event-card" onClick={handleCardClick}>
            <img className="event-cover-art"  src={`http://localhost:5000${comic["COVER_ART"]}` || "/images/defaultcover.webp"} alt={`${comic.TITLE} cover art`} loading='lazy' />
            <div className="event-card-details">
                <div className="event-card-title">{comic.TITLE}</div>
                {comic["PURCHASE_STATUS"] && (
                    <div className={purchaseStatusClass}>
                        {comic["PURCHASE_STATUS"]}
                    </div>
                )}
            </div>
            <Dialog.Root open={isModalOpen} onOpenChange={setModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="DialogOverlay" />
                    <Dialog.Content className="DialogContent">
                        <Dialog.Close asChild>
                            <button className="IconButton" onClick={handleCloseModal} aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                        <div className="modal-top-section">
                        <div className="modal-cover-art-container" >
                            <img className="cover-art-mobile"  src={`http://localhost:5000${comic["COVER_ART"]}` || "/images/defaultcover.webp"} alt={`${comic.TITLE} cover art`} loading='lazy' />
                            {getStatusBar(purchaseStatus)}
                        </div>
                            <div className="modal-comic-details">
                                <h3 className="modal-comic-card-title">{comic.TITLE} <span className='modal-comic-card-subtitle'>{comic.YEAR}</span></h3>
                                <div className="star-rating">
                                    {comic.RATING != null ? renderStars(comic.RATING) : <span>Not Yet Rated</span>}
                                </div>
                                <div className={`modal-status ${comic["HARDCOVER"] ? comic["HARDCOVER"].toLowerCase() : ''}`}>
                                    {comic["HARDCOVER"]}
                                </div>
                            </div>
                        </div>
                        <p className="modal-description">{comic.DESCRIPTION}</p>
                        {!isMobile && (
                            <p className="modal-description">
                            KEY CHARACTERS: {comic["KEY_CHARACTERS"].join(', ')}
                            </p>
                        )}
                        {comic.ISSUES !== "No issues information available" && (
                            <div className="issues">
                                <span>{comic.ISSUES}</span>
                            </div>
                        )}
                          {/* {!isMobile && comic.PAGES !== null && (
                                    <div className="page-count">
                                       <span>Page Count: {comic.PAGES}</span>
                                    </div>
                                )} */}
                        {comic.LINK && (
                            <a href={comic.LINK} className="comic-card-buy-button" target="_blank" rel="noopener noreferrer">
                                Buy on Amazon
                            </a>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default EventCardDesktop;
