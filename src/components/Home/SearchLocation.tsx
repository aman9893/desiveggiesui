import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown, User, LogOut, MapPin as MapPinIcon, ShoppingCart, Package, Zap, Grid3X3, Bike } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
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
    const { cartCount, setIsCartOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Detect mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfileMenu]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleProfileMenuClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        setShowProfileMenu(false);
    };

    const handleLogout = () => {
        // Clear user session and logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("selectedDeliveryLocation");
        navigate("/login");
        setShowProfileMenu(false);
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

    return isMobile ? (
        <div className={styles.container}>
            {/* Header with Location Selector */}
            <div className={styles.header}>
                        <div className={styles.deliveryLabel} style={{ color: "#022a01", fontWeight: "bold"  ,fontSize: "18px"}}>
                                 <Bike size={20} /> 
                                Desi Veggies 
                            </div>
                <div className={styles.headerContent}>
                    <button 
                        className={styles.locationSelector}
                        onClick={() => setShowLocationPicker(true)}
                    >
                        <div className={styles.locationInfo}>
                    
                            <div className={styles.locationDisplay}>
                                {selectedLocation ? (
                                    <>
                                      <MapPin className={styles.headerIcon} />
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

                    {/* Right Actions - Cart & User */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <button className="relative p-2 rounded-xl transition-colors hover:bg-orange-50" onClick={() => setIsCartOpen(true)}>
                            <ShoppingCart className="w-5 h-5 text-zinc-900" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* User Profile */}
                        <div className="relative" ref={profileMenuRef}>
                            {user ? (
                                <button 
                                    onClick={handleProfileMenuClick} 
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => navigate("/login")}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-colors"
                                >
                                    <User size={16} /> Sign In
                                </button>
                            )}

                            {/* Profile Dropdown Menu */}
                            {showProfileMenu && user && (
                                <>
                                    <div className="fixed inset-0 bg-black/50 z-[9997]" onClick={() => setShowProfileMenu(false)} />
                                    <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[9998] animate-fade-in">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
                                            <p className="text-xs text-zinc-500">{user?.email}</p>
                                        </div>
                                        <button 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => handleMenuItemClick("/profile")}
                                        >
                                            <User size={16} /> My Profile
                                        </button>
                                        <button 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => handleMenuItemClick("/orders")}
                                        >
                                            <Package size={16} /> My Orders
                                        </button>
                                        <button 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => handleMenuItemClick("/addresses")}
                                        >
                                            <MapPinIcon size={16} /> Addresses
                                        </button>
                                        <button 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => handleMenuItemClick("/products")}
                                        >
                                            <Grid3X3 size={16} /> Products
                                        </button>
                                        <button 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => handleMenuItemClick("/deals")}
                                        >
                                            <Zap size={16} /> Deals
                                        </button>
                                        <div className="border-t border-gray-200 pt-1">
                                            <button 
                                                onClick={handleLogout} 
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
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
    ) : null;
};

export default SearchLocation;
