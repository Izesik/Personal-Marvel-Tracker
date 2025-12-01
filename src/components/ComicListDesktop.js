import React, { useState, useEffect } from "react";
//import comics from '../comics_all_marvel_human_readable.json';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./ComicListNEW.css";
import ComicCardMobile from "./ComicCardMobile";
import EventCard from "./EventCard";
import AddComic from "./AddComic";
import * as Progress from "@radix-ui/react-progress";
import * as Dialog from "@radix-ui/react-dialog";
import { renderStars } from "../utils/utils";

// NEW COMPONENTS
import EraTitle from "./EraHeader/EraTitle";
import ProgressHeader from "./ProgressHeader/ProgressHeader";

const ComicListDesktop = () => {
  const [comics, setComics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredComics = comics.filter((comic) => !comic.DIVIDER); // Filter out comics with DIVIDER set to true
  const [isEditMode, setIsEditMode] = useState(false); // Toggle for dragging

  const eras = [...new Set(filteredComics.map((comic) => comic.ERA))]; // Get unique eras

  const totalComics = filteredComics.length;
  const purchasedComics = comics.filter(
    (comic) => comic["PURCHASE_STATUS"] === "Purchased"
  ).length;
  const progressValue = (purchasedComics / totalComics) * 100;

  const totalCost = comics.reduce((total, comic) => {
    return (
      total +
      (comic["PURCHASE_STATUS"] === "Purchased" && comic.COST
        ? parseFloat(comic.COST)
        : 0)
    );
  }, 0);

  // Calculate the total pages
  const totalPages = comics.reduce((total, comic) => {
    return total + (comic.PAGES ? parseInt(comic.PAGES) : 0);
  }, 0);

  // Calculate the average rating
  const ratings = comics
    .filter((comic) => comic.RATING != null && comic.RATING > 0)
    .map((comic) => parseFloat(comic.RATING));
  const averageRating = ratings.length
    ? (
        ratings.reduce((total, rating) => total + rating, 0) / ratings.length
      ).toFixed(1)
    : "N/A";

  useEffect(() => {
    fetch("/api/comics")
      .then((response) => response.json())
      .then((data) => setComics(data))
      .catch((error) => console.error("Error fetching comics:", error));
  }, []);

  /* Function to handle saving a comic (either new or edited) */
  const handleComicSaved = (newComic) => {
    setComics((prevComics) => {
      // Check if it's an edit or a new comic
      const existingIndex = prevComics.findIndex((c) => c._id === newComic._id);

      if (existingIndex !== -1) {
        // Update existing comic
        const updatedComics = [...prevComics];
        updatedComics[existingIndex] = newComic;
        return updatedComics;
      } else {
        // Add new comic
        return [...prevComics, newComic];
      }
    });
    setIsModalOpen(false); // Close modal after saving
  };

  const handleComicDeleted = (deletedComicId) => {
    setComics((prevComics) =>
      prevComics.filter((c) => c._id !== deletedComicId)
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = async (event) => {
    if (!isEditMode) return; // Prevent dragging when not in edit mode

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setComics((prevComics) => {
      // Step 1: Sort comics by ORDER field before making any changes
      const sortedComics = [...prevComics].sort((a, b) => a.ORDER - b.ORDER);

      const oldIndex = sortedComics.findIndex((c) => c._id === active.id);
      const newIndex = sortedComics.findIndex((c) => c._id === over.id);

      // Step 2: Reorder the comics based on drag event
      const updatedComics = arrayMove(sortedComics, oldIndex, newIndex);

      // Step 3: Assign new ORDER values sequentially
      const comicsWithUpdatedOrder = updatedComics.map((comic, index) => ({
        ...comic,
        ORDER: index, // Ensure ORDER is properly updated
      }));

      // Step 4: Send the new order to the backend
      updateComicOrderOnServer(comicsWithUpdatedOrder);

      return comicsWithUpdatedOrder;
    });
  };

  // Function to update comic order on the backend
  const updateComicOrderOnServer = async (updatedComics) => {
    try {
      console.log("Sending updated order to backend:", updatedComics); // Debugging

      const response = await fetch("/api/comics/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comics: updatedComics }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      console.log("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const getEraStatistics = (era) => {
    const eraComics = comics.filter((comic) => comic.ERA === era);
    const totalCost = eraComics.reduce(
      (total, comic) => total + (comic.COST ? parseFloat(comic.COST) : 0),
      0
    );
    const totalPages = eraComics.reduce(
      (total, comic) => total + (comic.PAGES ? parseInt(comic.PAGES) : 0),
      0
    );
    const ratings = eraComics
      .filter((comic) => comic.RATING != null && comic.RATING > 0)
      .map((comic) => parseFloat(comic.RATING));
    const averageRating = ratings.length
      ? (
          ratings.reduce((total, rating) => total + rating, 0) / ratings.length
        ).toFixed(1)
      : "N/A";
    const purchasedComics = eraComics.filter(
      (comic) => comic["PURCHASE_STATUS"] === "Purchased"
    ).length;

    return { totalCost, totalPages, averageRating, purchasedComics };
  };

  return (
    <div className="comic-list-container">
      <div className="comic-list-mobile">
        {/* 🔹 Edit Mode Banner */}
        {isEditMode && (
          <div className="edit-mode-banner">
            <p>🛠 You are in Edit Mode - Drag to reorder comics 🛠</p>
          </div>
        )}
        <ProgressHeader
          purchasedComics={purchasedComics}
          totalComics={totalComics}
          totalCost={totalCost}
          totalPages={totalPages}
          averageRating={averageRating}
        />
        {/* Edit Mode Toggle Button */}
        <button
          className="edit-mode-button"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "🛠" : "🛠"}
        </button>

        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="add-comic-button">+</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
              <Dialog.Close asChild>
                <button className="IconButton" aria-label="Close">
                  ✕
                </button>
              </Dialog.Close>
              <AddComic
                onClose={() => setIsModalOpen(false)}
                onComicSaved={handleComicSaved}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={onDragEnd}
        >
          {eras.map((era) => (
            <div id={era} key={era} className="era-section">
              <EraTitle
                era={era}
                purchasedComics={getEraStatistics(era).purchasedComics}
                totalComics={comics.filter((comic) => comic.ERA === era).length}
                totalCost={getEraStatistics(era).totalCost}
                totalPages={getEraStatistics(era).totalPages}
                averageRating={getEraStatistics(era).averageRating}
              />
              <SortableContext
                items={comics.filter((c) => c.ERA === era).map((c) => c._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="comic-grid">
                  {comics
                    .filter((comic) => comic.ERA === era)
                    .map((comic) => (
                      <SortableComic
                        key={comic._id}
                        comic={comic}
                        isEditMode={isEditMode}
                        handleComicDeleted={handleComicDeleted}
                        handleComicSaved={handleComicSaved}
                      />
                    ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

const SortableComic = ({
  comic,
  isEditMode,
  handleComicSaved,
  handleComicDeleted,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: comic._id, disabled: !isEditMode });

  // State to track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Apply grid column span dynamically based on screen width
  const getGridColumnSpan = () => {
    if (windowWidth <= 768) return comic.EVENT ? "span 3" : "span 1"; // Mobile (≤768px)
    if (windowWidth <= 1300) return comic.EVENT ? "span 7" : "span 1"; // Tablet (≤1300px)
    return comic.EVENT ? "span 10" : "span 1"; // Desktop (default)
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    gridColumn: getGridColumnSpan(), // Dynamically set grid span based on window width
    width: "100%", // Ensure it stretches properly
    cursor: isEditMode ? "grab" : "pointer", // Show hand when dragging is enabled
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode ? { ...attributes, ...listeners } : {})}
      className="sortable-item"
    >
      {comic.EVENT ? (
        <EventCard
          comic={comic}
          onComicSaved={handleComicSaved}
          onComicDeleted={handleComicDeleted}
        />
      ) : (
        <ComicCardMobile
          comic={comic}
          onComicSaved={handleComicSaved}
          onComicDeleted={handleComicDeleted}
        />
      )}
    </div>
  );
};

export default ComicListDesktop;
