import React, { useState, useEffect } from 'react';
import './AddComic.css';
import { renderStars } from '../utils/utils';


const AddComic = ({ onClose, onComicSaved, onComicDeleted, comic = null }) => {
    const [title, setTitle] = useState(comic ? comic.TITLE : 'New Comic Title');
    const [year, setYear] = useState(comic ? comic.YEAR : '');
    const [hardcover, setHardcover] = useState(comic ? comic.HARDCOVER === 'Hardcover' : false);
    const [purchaseStatus, setPurchaseStatus] = useState(comic ? comic.PURCHASE_STATUS : 'Not Purchased');
    const [description, setDescription] = useState(comic ? comic.DESCRIPTION : 'Enter comic description...');
    const [keyCharacters, setKeyCharacters] = useState(comic ? comic.KEY_CHARACTERS : []);
    const [keyCharacterInput, setKeyCharacterInput] = useState('');
    const [existingCharacters, setExistingCharacters] = useState([]); // Holds all characters from the database
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [issues, setIssues] = useState(comic ? comic.ISSUES : '');
    const [link, setLink] = useState(comic ? comic.LINK : '');
    const [coverArt, setCoverArt] = useState(comic ? comic.COVER_ART : null);
    const [era, setEra] = useState(comic ? comic.ERA : '');
    const [newEra, setNewEra] = useState('');
    const [existingEras, setExistingEras] = useState([]);
    const [showNewEraInput, setShowNewEraInput] = useState(false);
    const [rating, setRating] = useState(comic ? parseFloat(comic.RATING) || 0 : 0);
    const [pages, setPages] = useState(comic ? comic.PAGES || '' : '');
    const [cost, setCost] = useState(comic ? comic.COST || '' : '');
    const [isEvent, setIsEvent] = useState(comic ? comic.EVENT || false : false);




    useEffect(() => {
        fetch('/api/comics')
            .then(response => response.json())
            .then(data => {
                const eras = [...new Set(data.map(comic => comic.ERA).filter(Boolean))];
                setExistingEras(eras);

                const allCharacters = new Set();
                data.forEach(comic => {
                    if (comic.KEY_CHARACTERS) {
                        comic.KEY_CHARACTERS.forEach(character => allCharacters.add(character));
                    }
                });
                setExistingCharacters([...allCharacters]); // Store unique characters
            })
            .catch(error => console.error('Error fetching comics:', error));
    }, []);

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };
    
    const handleStarDoubleClick = (starValue) => {
        setRating(starValue - 0.5);
    };
    
    

    const handleYearChange = (e) => {
        const input = e.target.value;
        if (/^\d{0,4}$/.test(input)) {
            setYear(input);
        }
    };

    const handleKeyCharacterInput = (e) => {
        const input = e.target.value;
        setKeyCharacterInput(input);

        if (input.length > 1) {
            const suggestions = existingCharacters.filter(char => char.toLowerCase().includes(input.toLowerCase()));
            setFilteredSuggestions(suggestions);
        } else {
            setFilteredSuggestions([]);
        }

        if (e.key === 'Enter' && keyCharacterInput.trim() !== '') {
            e.preventDefault();
            setKeyCharacters([...keyCharacters, keyCharacterInput.trim()]);
            setKeyCharacterInput('');
        }
    };

    const removeKeyCharacter = (index) => {
        setKeyCharacters(keyCharacters.filter((_, i) => i !== index));
    };

    const handleAddNewEra = () => {
        if (newEra.trim() !== '') {
            setExistingEras([...existingEras, newEra]);
            setEra(newEra);
            setNewEra('');
            setShowNewEraInput(false);
        }
    };

    

    const handleAmazonLinkChange = (e) => {
        let input = e.target.value.trim();
    
        // Ensure input is a valid URL format
        if (input && !input.startsWith('http://') && !input.startsWith('https://')) {
            input = 'https://' + input;
        }
    
        setLink(input);
    };

    const handleIssuesChange = (e) => {
        let input = e.target.value;
    
        // Ensure it always starts with "Collects"
        if (!input.toLowerCase().startsWith("collects")) {
            input = "Collects " + input.replace(/^Collects\s*/, '');
        }
    
        setIssues(input);
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('coverArt', file);
    
        const response = await fetch('/api/comics/upload', {
            method: 'POST',
            body: formData
        });
    
        if (!response.ok) {
            console.error('Upload failed');
            throw new Error('Upload failed');
        }
    
        const data = await response.json();
        console.log('Image uploaded, returned path:', data.filePath); // Debugging log
    
        return data.filePath; // Ensure this is returned correctly
    };
    
    

    const cyclePurchaseStatus = () => {
        const statuses = ['Not Purchased', 'Ordered', 'Pre-Ordered', 'Purchased'];
        const currentIndex = statuses.indexOf(purchaseStatus);
        setPurchaseStatus(statuses[(currentIndex + 1) % statuses.length]); // Cycle through statuses
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !year || !coverArt || (!era && !newEra) || !description) {
            alert('Title, Year, Cover Art, Era, and Description are required!');
            return;
        }

        let filePath = coverArt && typeof coverArt !== 'string' ? await handleImageUpload(coverArt) : comic?.COVER_ART || '';

        const comicData = {
            TITLE: title,
            PURCHASE_STATUS: purchaseStatus,
            HARDCOVER: hardcover ? 'Hardcover' : 'Paperback',
            DESCRIPTION: description,
            KEY_CHARACTERS: keyCharacters,
            COVER_ART: filePath, // Store uploaded image path
            YEAR: year,
            ERA: newEra || era,
            LINK: link,
            ISSUES: issues,
            RATING: rating, // Include rating when saving
            PAGES: pages ? parseInt(pages) : null,
            COST: cost ? parseFloat(cost).toFixed(2) : null,
            EVENT: isEvent, // Store event status
        };

        const response = await fetch(`/api/comics${comic?._id ? `/${comic._id}` : ''}`, {
            method: comic ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comicData),
        });
    
        if (response.ok) {
            const savedComic = await response.json();
            onComicSaved(savedComic); // ✅ Updates the comics state in `ComicListDesktop.js`
            onClose(); // ✅ Closes the modal
        } else {
            console.error('Error saving comic');
        }

    };

    return (
        <div className="comic-modal-content">
            <div className="comic-modal-top-section">
                <div className="comic-cover-art-container">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverArt(e.target.files[0])}
                        style={{ display: 'none' }}
                        id="coverUpload"
                    />
                    <label htmlFor="coverUpload">
                        <img
                            className="comic-cover-image"
                            src={coverArt
                                ? (typeof coverArt === 'string' ? `http://localhost:5000${coverArt}` : URL.createObjectURL(coverArt))
                                : "/images/defaultcover.webp"}
                            alt="Comic Cover"
                            loading="lazy"
                            style={{ cursor: 'pointer' }}
                        />
                    </label>
                </div>
                <div className="comic-modal-details">
                    <input
                        type="text"
                        className="comic-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        className="comic-year-input"
                        value={year}
                        onChange={handleYearChange}
                        placeholder="Year (YYYY)"
                    />
                {/* Only show rating if editing an existing comic */}
                {comic && (
                    <div className="comic-rating-container">
                        <div className="star-rating-input">
                            {renderStars(rating).map((star, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleStarClick(index + 1)}
                                    onDoubleClick={() => handleStarDoubleClick(index + 1)}
                                >
                                    {star}
                                </span>
                            ))}
                        </div>
                    </div>
                )}


                    <div className="comic-status-container">
                        <div className={`comic-status ${hardcover ? 'hardcover' : 'paperback'}`} onClick={() => setHardcover(!hardcover)}>
                            {hardcover ? 'Hardcover' : 'Paperback'}
                        </div>
                        <div className={`comic-purchase-status ${purchaseStatus.replace(" ", "-").toLowerCase()}`} onClick={cyclePurchaseStatus}>
                            {purchaseStatus}
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <textarea
                className="comic-description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Key Characters & Era - Now Inline */}
            <div className="comic-key-era-container">
                {/* Key Characters */}
                <div className="comic-key-characters">
                    <label className="comic-label">Key Characters:</label>
                    {keyCharacters.length > 0 && (
                        <div className="key-character-tags">
                            {keyCharacters.map((character, index) => (
                                <span key={index} className="key-character-tag">
                                    {character}
                                    <button onClick={() => removeKeyCharacter(index)}>&times;</button>
                                </span>
                            ))}
                        </div>
                    )}
                    {/* Input field with dropdown positioning logic */}
                    <div className="input-dropdown-container">
                        <input
                            type="text"
                            className="comic-key-input"
                            placeholder="Type and press Enter"
                            value={keyCharacterInput}
                            onChange={handleKeyCharacterInput}
                            onKeyDown={handleKeyCharacterInput}
                        />

                        {/* Suggestion dropdown appears dynamically below or above */}
                        {filteredSuggestions.length > 0 && (
                            <ul className="suggestions-dropdown">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => {
                                        setKeyCharacters([...keyCharacters, suggestion]);
                                        setKeyCharacterInput('');
                                        setFilteredSuggestions([]);
                                    }}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Era Dropdown + Add Button (Now Next to Key Characters) */}
                <div className="comic-era-section">
                    <label className="comic-label">Era:</label>
                    <div className="comic-era-container">
                        <select
                            className="comic-dropdown"
                            value={era}
                            onChange={(e) => setEra(e.target.value)}
                        >
                            <option value="">Select Era</option>
                            {existingEras.map((eraOption, index) => (
                                <option key={index} value={eraOption}>{eraOption}</option>
                            ))}
                        </select>
                        <button className="comic-era-add-button" onClick={() => setShowNewEraInput(!showNewEraInput)}>＋</button>
                    </div>
                    {showNewEraInput && (
                        <div className="comic-new-era">
                            <input
                                type="text"
                                className="comic-era-input"
                                placeholder="Enter new era"
                                value={newEra}
                                onChange={(e) => setNewEra(e.target.value)}
                            />
                            <button className="comic-era-save-button" onClick={handleAddNewEra}>✔</button>
                        </div>
                    )}
                </div>
            </div>


            {/* Issues & Amazon Link */}
            <div className="comic-input-container">
            <label className="comic-label">Issues:</label>
                <input
                    type="text"
                    className="comic-input"
                    value={issues}
                    onChange={handleIssuesChange}
                    placeholder='Collects SERIES NAME (YEAR) #1-14 and #16 and OTHER SERIES (YEAR) #4'
                />
                 <label className="comic-label">Amazon Link:</label>
                <input
                    type="text"
                    className="comic-input"
                    value={link}
                    onChange={handleAmazonLinkChange}
                    placeholder="Enter a valid Amazon link (https://www.amazon.com/...)"
                />
            </div>
            <div className="comic-input-row">

            {/* Pages Input */}
            <div className="comic-input-container">
                <label className="comic-label">Pages:</label>
                <input
                    type="number"
                    className="comic-input"
                    placeholder="Number of pages"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    min="1"
                />
            </div>

            {/* Cost Input */}
            <div className="comic-input-container">
                <label className="comic-label">Cost ($):</label>
                <input
                    type="number"
                    className="comic-input"
                    placeholder="Cost in USD"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="comic-event-toggle">
                        <label className="comic-event-label">Marvel Event?</label>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="eventToggle"
                                className="toggle-checkbox"
                                checked={isEvent}
                                onChange={() => setIsEvent(!isEvent)}
                            />
                            <label htmlFor="eventToggle" className="toggle-label"></label>
                        </div>
            </div>
        </div>


            <button className="comic-save-button" onClick={handleSubmit}>Save</button>
        </div>
    );
};

export default AddComic;
