import { useEffect, useRef, useState } from "react";
import { MapPin, X, Loader } from "lucide-react";
import styles from "./LocationPickerModal.module.css";

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: { address: string; city: string; areaName: string; buildingName: string; lat: number; lng: number; label: string }) => void;
}

const LocationPickerModal = ({ isOpen, onClose, onSelectLocation }: LocationPickerModalProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState("");
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Initialize map
    useEffect(() => {
        if (!isOpen || !mapContainerRef.current) return;

        const map = new google.maps.Map(mapContainerRef.current, {
            zoom: 15,
            center: { lat: 28.7041, lng: 77.1025 }, // Default to Delhi
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
        });

        const marker = new google.maps.Marker({
            position: { lat: 28.7041, lng: 77.1025 },
            map: map,
            title: "Your Location",
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });

        googleMapRef.current = map;
        markerRef.current = marker;

        // Get user's current location
        if (navigator.geolocation) {
            setIsLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const loc = { lat, lng };

                    setCurrentLocation(loc);
                    map.setCenter(loc);
                    marker.setPosition(loc);

                    // Get address from coordinates
                    getAddressFromCoordinates(lat, lng);
                    setIsLoadingLocation(false);
                },
                () => {
                    setIsLoadingLocation(false);
                }
            );
        }

        // Add click listener to map
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                marker.setPosition({ lat, lng });
                setCurrentLocation({ lat, lng });
                getAddressFromCoordinates(lat, lng);
            }
        });

        // Setup autocomplete
        const searchInputElement = document.getElementById("locationSearch") as HTMLInputElement;
        if (searchInputElement) {
            const autocomplete = new google.maps.places.Autocomplete(searchInputElement, {
                fields: ["geometry", "formatted_address", "address_components"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry?.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    marker.setPosition({ lat, lng });
                    map.setCenter({ lat, lng });
                    setCurrentLocation({ lat, lng });
                    setAddress(place.formatted_address || "");
                }
            });

            autocompleteRef.current = autocomplete;
        }
    }, [isOpen]);

    const getAddressFromCoordinates = (lat: number, lng: number) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                setAddress(results[0].formatted_address);
            }
        });
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const loc = { lat, lng };

                    setCurrentLocation(loc);
                    if (googleMapRef.current) {
                        googleMapRef.current.setCenter(loc);
                    }
                    if (markerRef.current) {
                        markerRef.current.setPosition(loc);
                    }
                    getAddressFromCoordinates(lat, lng);
                    setIsLoadingLocation(false);
                },
                (_error) => {
                    alert("Unable to access your location. Please enable location services.");
                    setIsLoadingLocation(false);
                }
            );
        }
    };

    const handleConfirmLocation = () => {
        if (!currentLocation || !address) {
            alert("Please select a location");
            return;
        }

        const parts = address.split(",");
        const city = parts[parts.length - 2]?.trim() || "";
        const areaName = parts[parts.length - 3]?.trim() || "";
        const buildingName = parts[0]?.trim() || "";

        const locationData = {
            address,
            city,
            areaName,
            buildingName,
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            label: "Current Location",
        };

        // Save to localStorage for live location tracking
        localStorage.setItem("selectedDeliveryLocation", JSON.stringify({ 
            lat: currentLocation.lat, 
            lng: currentLocation.lng 
        }));

        onSelectLocation(locationData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Select Delivery Location</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        id="locationSearch"
                        type="text"
                        placeholder="Search location or address..."
                        className={styles.searchInput}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <div className={styles.mapContainer} ref={mapContainerRef} />

                <div className={styles.currentLocationButton}>
                    <button onClick={handleUseCurrentLocation} className={styles.enableButton} disabled={isLoadingLocation}>
                        {isLoadingLocation ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Getting location...
                            </>
                        ) : (
                            <>
                                <MapPin className="w-5 h-5" />
                                Use Current Location
                            </>
                        )}
                    </button>
                </div>

                {address && (
                    <div className={styles.addressDisplay}>
                        <div className={styles.addressIcon}>
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className={styles.addressContent}>
                            <p className={styles.addressLabel}>Selected Location</p>
                            <p className={styles.addressText}>{address}</p>
                        </div>
                    </div>
                )}

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancel
                    </button>
                    <button onClick={handleConfirmLocation} className={styles.confirmButton} disabled={!address || !currentLocation}>
                        Confirm Location
                    </button>
                </div>
            </div>
        </>
    );
};

export default LocationPickerModal;
