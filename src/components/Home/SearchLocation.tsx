import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LocationPickerModal from "./LocationPickerModal";
import styles from "./SearchLocation.module.css";

interface Location {
    label: string;
    address: string;
    city: string;
    areaName?: string;
    buildingName?: string;
    lat: number;
    lng: number;
}

const SearchLocation = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    // Load location from localStorage on component mount
    useEffect(() => {
        const savedLocation = localStorage.getItem("selectedDeliveryLocation");
        if (savedLocation) {
            try {
                const location = JSON.parse(savedLocation);
                setSelectedLocation(location);
            } catch (error) {
                console.error("Failed to parse saved location:", error);
                // Fallback to user's first address
                if (user?.addresses?.[0]) {
                    setSelectedLocation(user.addresses[0]);
                }
            }
        } else if (user?.addresses?.[0]) {
            // If no saved location, use user's first address
            setSelectedLocation(user.addresses[0]);
        }
    }, [user]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        // Store selected location in localStorage for delivery tracking
        localStorage.setItem("selectedDeliveryLocation", JSON.stringify(location));
    };

    const handleMapLocationSelect = (location: { address: string; city: string; areaName: string; buildingName: string; lat: number; lng: number; label: string }) => {
        const newLocation: Location = {
            label: location.label,
            address: location.address,
            city: location.city,
            areaName: location.areaName,
            buildingName: location.buildingName,
            lat: location.lat,
            lng: location.lng,
        };
        handleLocationSelect(newLocation);
        setShowLocationPicker(false);
        window.scrollTo(0, 0);
    };

    const handleCloseLocationPicker = () => {
        setShowLocationPicker(false);
        window.scrollTo(0, 0);
    };

    return (
        <div className={styles.container}>
            {/* Header with Location Selector */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <button 
                        className={styles.locationSelector}
                        onClick={() => setShowLocationPicker(true)}
                    >
                        <div className={styles.locationInfo}>
                            <div className={styles.deliveryLabel}>
                                <MapPin className={styles.headerIcon} />
                                Delivery to
                            </div>
                            <div className={styles.locationDisplay}>
                                {selectedLocation ? (
                                    <>
                                        <span className={styles.areaName}>
                                            {selectedLocation.areaName || selectedLocation.label}
                                        </span>
                                        <ChevronDown className={styles.chevronIcon} />
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.areaName}>Select Location</span>
                                        <ChevronDown className={styles.chevronIcon} />
                                    </>
                                )}
                            </div>
                            {selectedLocation && (
                                <div className={styles.addressDetail}>
                                    <div>{selectedLocation.address}</div>
                                </div>
                            )}
                        </div>
                    </button>

                    <button 
                        className={styles.profileButton}
                        onClick={() => navigate("/profile")}
                    >
                        <User className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar Below Header */}
                <form onSubmit={handleSearch} className={styles.searchBar}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchBarIcon} />
                        <input
                            type="text"
                            placeholder="Search for vegetables, fruits..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchBarInput}
                        />
                    </div>
                </form>
            </div>

            {/* Location Picker Modal */}
            <LocationPickerModal
                isOpen={showLocationPicker}
                onClose={handleCloseLocationPicker}
                onSelectLocation={handleMapLocationSelect}
            />
        </div>
    );
};

export default SearchLocation;
