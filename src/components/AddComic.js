import React, { useState, useEffect } from 'react';
import './AddComic.css'; // Create this CSS file for custom styles

const AddComic = () => {
    const [title, setTitle] = useState('');
    const [purchaseStatus, setPurchaseStatus] = useState('');
    const [cost, setCost] = useState('');
    const [hardcover, setHardcover] = useState(false);
    const [pages, setPages] = useState('');
    const [rating, setRating] = useState('');
    const [description, setDescription] = useState('');
    const [keyCharacters, setKeyCharacters] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [coverArt, setCoverArt] = useState(null);
    const [year, setYear] = useState('');
    const [era, setEra] = useState('');
    const [newEra, setNewEra] = useState('');
    const [link, setLink] = useState('');
    const [issues, setIssues] = useState('');
    const [existingEras, setExistingEras] = useState([]);
    const [errors, setErrors] = useState({}); // To store validation errors


    const handleCheckboxChange = () => {
        setHardcover(!hardcover);
    };

    useEffect(() => {
        // Fetch comics data to extract eras
        fetch('/api/comics')
            .then(response => response.json())
            .then(data => {
                const eras = [...new Set(data.map(comic => comic.ERA).filter(Boolean))];
                setExistingEras(eras);
            })
            .catch(error => console.error('Error fetching comics:', error));
    }, []);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('coverArt', file);
    
        const response = await fetch('/api/comics/upload', {
            method: 'POST',
            body: formData
        });
    
        // Check the response status
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', errorText);
            throw new Error('Upload failed');
        }
    
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data.filePath;  // This is the file path returned from the backend
        } else {
            const errorText = await response.text();
            console.error('Unexpected response format:', errorText);
            throw new Error('Unexpected response format');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!purchaseStatus) newErrors.purchaseStatus = 'Purchase status is required';
        if (!cost) newErrors.cost = 'Cost is required';
        if (!year) newErrors.year = 'Year is required';
        if (!coverArt) newErrors.coverArt = 'Cover Art is required';
        return newErrors;
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const filePath = await handleImageUpload(coverArt);

        const comicData = {
            TITLE: title, // From frontend state
            PURCHASE_STATUS: purchaseStatus,
            COST: parseFloat(cost), // Convert to number if needed
            HARDCOVER: hardcover ? 'Hardcover' : 'Paperback',
            PAGES: parseInt(pages), // Convert to number if needed
            RATING: parseFloat(rating), // Convert to number if needed
            DESCRIPTION: description,
            KEY_CHARACTERS: keyCharacters.split(',').map(char => char.trim()), // Convert to array
            RELEASE_DATE: releaseDate,
            COVER_ART: filePath,
            YEAR: year,
            ERA: era,
            LINK: link,
            ISSUES: issues
        };

        await fetch('/api/comics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comicData),
        });
    };

    return (
        <form className="add-comic-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Title <span className="required">*</span></label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="purchaseStatus">Purchase Status <span className="required">*</span></label>
                <select
                    id="purchaseStatus"
                    value={purchaseStatus}
                    onChange={(e) => setPurchaseStatus(e.target.value)}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="Purchased">Purchased</option>
                    <option value="Not Purchased">Not Purchased</option>
                    <option value="Not Purchased">Pre-Ordered</option>
                    <option value="Not Purchased">Ordered</option>
                </select>
                {errors.purchaseStatus && <span className="error-message">{errors.purchaseStatus}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="cost">Cost <span className="required">*</span></label>
                <input
                    id="cost"
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="Cost"
                    required
                />
                {errors.cost && <span className="error-message">{errors.cost}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="hardcover">Hardcover?</label>
                <input
                    id="hardcover"
                    type="checkbox"
                    checked={hardcover}
                    onChange={handleCheckboxChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="pages">Pages</label>
                <input
                    id="pages"
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="Pages"
                />
            </div>

            <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                >
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
            </div>

            <div className="form-group">
                <label htmlFor="keyCharacters">Key Characters (comma-separated)</label>
                <input
                    id="keyCharacters"
                    type="text"
                    value={keyCharacters}
                    onChange={(e) => setKeyCharacters(e.target.value)}
                    placeholder="Key Characters"
                />
            </div>

            <div className="form-group">
                <label htmlFor="releaseDate">Release Date</label>
                <input
                    id="releaseDate"
                    type="text"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    placeholder="Release Date"
                />
            </div>

            <div className="form-group">
                <label htmlFor="coverArt">Cover Art <span className="required">*</span></label>
                <input
                    id="coverArt"
                    name="coverArt"
                    type="file"
                    onChange={(e) => setCoverArt(e.target.files[0])}
                    required
                />
                {errors.coverArt && <span className="error-message">{errors.coverArt}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="year">Year <span className="required">*</span></label>
                <input
                    id="year"
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                    required
                />
                {errors.year && <span className="error-message">{errors.year}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="era">Era</label>
                <select
                    id="era"
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                >
                    <option value="">Select Era</option>
                    {existingEras.map((eraOption, index) => (
                        <option key={index} value={eraOption}>{eraOption}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newEra}
                    onChange={(e) => setNewEra(e.target.value)}
                    placeholder="Or add a new era"
                />
            </div>

            <div className="form-group">
                <label htmlFor="link">Link</label>
                <input
                    id="link"
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Link"
                />
            </div>

            <div className="form-group">
                <label htmlFor="issues">Issues</label>
                <input
                    id="issues"
                    type="text"
                    value={issues}
                    onChange={(e) => setIssues(e.target.value)}
                    placeholder="Issues"
                />
            </div>

            <button type="submit">Add Comic</button>
        </form>
    );
};

export default AddComic;
