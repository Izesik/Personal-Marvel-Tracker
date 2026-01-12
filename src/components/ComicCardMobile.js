import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, GearIcon, TrashIcon } from "@radix-ui/react-icons";
import "./ComicCardMobile.css";
import "./Modal.css";
import { renderStars } from "../utils/utils";
import AddComic from "./AddComic";

const ComicCardMobile = ({
  comic,
  updateComic,
  onComicSaved,
  onComicDeleted,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1300);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1300);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEditing(false); // Reset edit mode when closing
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDelete = async (comicId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comic?"
    );
    if (!isConfirmed) return;

    const response = await fetch(`/api/comics/${comicId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onComicDeleted(comicId); // ✅ Remove the comic from the UI
      setModalOpen(false); // ✅ Close the modal
    } else {
      console.error("Error deleting comic");
    }
  };

  const purchaseStatus = comic["PURCHASE_STATUS"];

  const getStatusBarDialog = (status) => {
    if (status === "Purchased")
      return (
        <div className="status-bar-dialog purchased-mobile">Purchased</div>
      );
    if (status === "Pre-Ordered")
      return (
        <div className="status-bar-dialog pre-ordered-mobile">Pre-Ordered</div>
      );
    if (status === "Ordered")
      return <div className="status-bar-dialog ordered-mobile">Ordered</div>;
    return null;
  };

  const getStatusBarModalDialog = (status) => {
    if (status === "Purchased")
      return (
        <div className="status-bar-dialog-modal purchased-mobile">
          Purchased
        </div>
      );
    if (status === "Pre-Ordered")
      return (
        <div className="status-bar-dialog-modal pre-ordered-mobile">
          Pre-Ordered
        </div>
      );
    if (status === "Ordered")
      return (
        <div className="status-bar-dialog-modal ordered-mobile">Ordered</div>
      );
    return null;
  };

  const getHardcoverClass = (status) => {
    return status === "Hardcover" ? "hardcover" : "paperback";
  };

  return (
    <div className="comic-card-mobile">
      <div className="cover-art-container" onClick={handleCardClick}>
        <img
          className="cover-art-mobile"
          src={
            `http://localhost:5000${comic["COVER_ART"]}` ||
            "/images/defaultcover.webp"
          }
          alt={`${comic.TITLE} cover art`}
          loading="lazy"
        />
        {getStatusBarDialog(purchaseStatus)}
      </div>
      <Dialog.Root open={isModalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Close asChild>
              <button
                className="IconButton"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>

            {/* Edit Button */}
            {!isEditing && (
              <button className="edit-icon" onClick={handleEditClick}>
                <GearIcon />
              </button>
            )}

            {isEditing ? (
              <>
                {/* Trash Can Button (Only when editing an existing comic) */}
                {comic && (
                  <button
                    className="edit-icon"
                    onClick={() => handleDelete(comic._id)}
                    aria-label="Delete Comic"
                  >
                    <TrashIcon />
                  </button>
                )}

                {/* AddComic Component */}
                <AddComic
                  comic={comic}
                  onClose={handleCloseModal}
                  updateComic={updateComic}
                  onComicSaved={onComicSaved}
                  onComicDeleted={onComicDeleted}
                />
              </>
            ) : (
              <>
                <div className="modal-top-section">
                  <div className="modal-cover-art-container">
                    <img
                      className="cover-art-mobile"
                      src={
                        `http://localhost:5000${comic["COVER_ART"]}` ||
                        "/images/defaultcover.webp"
                      }
                      alt={`${comic.TITLE} cover art`}
                      loading="lazy"
                    />
                    {getStatusBarModalDialog(purchaseStatus)}
                  </div>
                  <div className="modal-comic-details">
                    <h3 className="modal-comic-card-title">
                      {comic.TITLE}{" "}
                      <span className="modal-comic-card-subtitle">
                        {comic.YEAR}
                      </span>
                    </h3>
                    <div className="star-rating">
                      {comic.RATING && comic.RATING > 0 ? (
                        renderStars(comic.RATING)
                      ) : (
                        <span>Not Yet Rated</span>
                      )}
                    </div>
                    <div
                      className={`modal-status ${getHardcoverClass(
                        comic["HARDCOVER"]
                      )}`}
                    >
                      {comic["HARDCOVER"]}
                    </div>
                  </div>
                </div>
                <p className="modal-description">{comic.DESCRIPTION}</p>
                {!isMobile && (
                  <p className="modal-description">
                    KEY CHARACTERS: {comic["KEY_CHARACTERS"].join(", ")}
                  </p>
                )}
                {comic.ISSUES !== "No issues information available" && (
                  <div className="page-count">
                    <span>{comic.ISSUES}</span>
                  </div>
                )}
                {comic.LINK && (
                  <a
                    href={comic.LINK}
                    className="comic-card-buy-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy on Amazon
                  </a>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default ComicCardMobile;
