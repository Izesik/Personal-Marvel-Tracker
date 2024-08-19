
import React, { useState, useEffect } from 'react';
//import comics from '../comics_all_marvel_human_readable.json';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './ComicListNEW.css';
import ComicCardMobile from './ComicCardMobile';
import EventCard from './EventCard';
import AddComic from './AddComic';
import * as Progress from '@radix-ui/react-progress';
import * as Dialog from '@radix-ui/react-dialog';
import { renderStars } from '../utils/utils';


const ComicListDesktop = () => {
    const [comics, setComics] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const filteredComics = comics.filter(comic => !comic.DIVIDER); // Filter out comics with DIVIDER set to true

    const eras = [...new Set(filteredComics.map(comic => comic.ERA))]; // Get unique eras

    const totalComics = filteredComics.length;
    const purchasedComics = comics.filter(comic => comic["PURCHASE STATUS"] === 'Purchased').length;
    const progressValue = (purchasedComics / totalComics) * 100;

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

useEffect(() => {
    fetch('/api/comics')
        .then(response => response.json())
        .then(data => setComics(data))
        .catch(error => console.error('Error fetching comics:', error));
}, []);
const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredComics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComics(prevComics => {
        const newComics = [...prevComics];
        eras.forEach(era => {
            const eraComics = newComics.filter(comic => comic.ERA === era);
            eraComics.sort((a, b) => items.indexOf(a) - items.indexOf(b));
        });
        return newComics;
    });
};

  return (
      <div className="comic-list-mobile">
         <div className="progress-bar-container">
              <Progress.Root className="ProgressRoot" value={progressValue}>
                  <Progress.Indicator className="ProgressIndicator" style={{ width: `${progressValue}%` }} />
              </Progress.Root>
              <div className="progress-text">{`PURCHASED: ${purchasedComics} / ${totalComics}`}</div>
              <div className="progress-text"> TOTAL SPENT: ${totalCost.toFixed(2)} | TOTAL PAGES: {totalPages}</div>
              <div className="progress-text">AVG RATING: {renderStars(averageRating)}</div>
              <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <Dialog.Trigger asChild>
                        <button>Add Comic</button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Close asChild>
                                <button className="IconButton" aria-label="Close">
                                    {/* You can replace this with an icon */}
                                    ✕
                                </button>
                            </Dialog.Close>
                            <AddComic />
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
          </div>
          {eras.map((era, eraIndex) => (
              <div key={eraIndex} className="era-section">
                  <div className="era-title">{era.toUpperCase()}</div>
                  <div className="comic-grid">
                      {filteredComics.filter(comic => comic.ERA === era).map((comic, comicIndex) => (
                          comic.EVENT ? 
                          <EventCard key={comicIndex} comic={comic} /> : 
                          <ComicCardMobile key={comicIndex} comic={comic} />
                      ))}
                  </div>
              </div>
          ))}
      </div>
  );
};

export default ComicListDesktop;

