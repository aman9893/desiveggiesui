import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import styles from "./MobileSearch.module.css";
import { X, Search } from "lucide-react";

interface SearchSuggestion {
    id: string;
    text: string;
    image: string;
    price: number;
}

const MobileSearch = ({ onClose }: { onClose: () => void }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchChange = async (value: string) => {
        setSearchQuery(value);

        if (value.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await api.get("/search/suggestions", {
                params: { q: value.trim() },
            });
            setSuggestions(data.suggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setSuggestions([]);
            onClose();
        }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
        setSearchQuery("");
        setSuggestions([]);
        onClose();
    };

    return (
        <div className={styles.searchContainer}>
            {/* Overlay */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Search Modal */}
            <div className={styles.searchModal}>
                {/* Header */}
                <div className={styles.searchHeader}>
                    <h2 className={styles.title}>Search Products</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.inputContainer}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search for groceries..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        <Search className="w-5 h-5" />
                    </button>
                </form>

                {/* Suggestions */}
                {searchQuery.trim().length >= 2 && (
                    <div className={styles.suggestionsContainer}>
                        {isLoading ? (
                            <div className={styles.loadingText}>Loading suggestions...</div>
                        ) : suggestions.length > 0 ? (
                            <div className={styles.suggestionsList}>
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={styles.suggestionItem}
                                    >
                                        <img src={suggestion.image} alt={suggestion.text} className={styles.suggestionImage} />
                                        <div className={styles.suggestionContent}>
                                            <p className={styles.suggestionText}>{suggestion.text}</p>
                                            <p className={styles.suggestionPrice}>₹{suggestion.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noSuggestions}>No products found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileSearch;
