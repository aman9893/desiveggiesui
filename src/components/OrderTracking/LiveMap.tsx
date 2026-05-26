import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MapPinIcon, Navigation2Icon } from "lucide-react";
import { iconsForLeafpad } from "../../assets/assets";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function LiveMap({ order, liveLocation }: { order: any; liveLocation: any }) {
    const [showDirections, setShowDirections] = useState(false);

    // Custom delivery truck icon
    const truckIcon = new L.Icon({
        iconUrl: iconsForLeafpad.truck,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });

    // Destination pin icon
    const destinationIcon = new L.Icon({
        iconUrl: iconsForLeafpad.destination,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    // Component to re-center map when location changes
    function MapUpdater({ center }: { center: [number, number] }) {
        const map = useMap();
        useEffect(() => {
            map.setView(center, map.getZoom());
        }, [center, map]);
        return null;
    }

    // Generate direction URL for Google Maps
    const generateDirectionUrl = () => {
        if (!liveLocation || !order.shippingAddress) return "";
        
        const origin = `${liveLocation.lat},${liveLocation.lng}`;
        const destination = `${order.shippingAddress.lat},${order.shippingAddress.lng}`;
        
        // Try to detect user agent and open appropriate map app
        const userAgent = navigator.userAgent;
        
        if (/iPhone|iPad|iPod/.test(userAgent)) {
            // iOS - use Apple Maps
            return `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`;
        } else {
            // Android and others - use Google Maps
            return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        }
    };

    // Handle start direction
    const handleStartDirection = () => {
        const directionUrl = generateDirectionUrl();
        if (directionUrl) {
            window.open(directionUrl, "_blank");
            setShowDirections(true);
        }
    };

    return (
        <>
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <div className="space-y-3">
                    <div className="rounded-2xl overflow-hidden border border-app-border" style={{ height: 280 }}>
                        {liveLocation && liveLocation.lat !== 0 ? (
                            <MapContainer center={[liveLocation.lat, liveLocation.lng]} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[liveLocation.lat, liveLocation.lng]} icon={truckIcon}>
                                    <Popup>
                                        <div className="text-sm">
                                            <p className="font-semibold">{order.deliveryPartner?.name}</p>
                                            <p className="text-xs text-gray-600">{order.deliveryPartner?.vehicleType}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                                {order.shippingAddress?.lat && order.shippingAddress?.lng && (
                                    <Marker position={[order.shippingAddress.lat, order.shippingAddress.lng]} icon={destinationIcon}>
                                        <Popup>
                                            <div className="text-sm">
                                                <p className="font-semibold">Delivery Address</p>
                                                <p className="text-xs text-gray-600">{order.shippingAddress.address}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                                <MapUpdater center={[liveLocation.lat, liveLocation.lng]} />
                            </MapContainer>
                        ) : order.shippingAddress?.lat && order.shippingAddress?.lng ? (
                            <MapContainer center={[order.shippingAddress.lat, order.shippingAddress.lng]} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[order.shippingAddress.lat, order.shippingAddress.lng]} icon={destinationIcon}>
                                    <Popup>
                                        <div className="text-sm">
                                            <p className="font-semibold">Delivery Address</p>
                                            <p className="text-xs text-gray-600">{order.shippingAddress.address}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="h-full bg-app-green/5 flex-center">
                                <div className="text-center">
                                    <MapPinIcon className="size-8 text-app-green/40 mx-auto mb-2" />
                                    <p className="text-sm text-app-green/50 font-medium">Waiting for delivery partner location...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Direction Button */}
                    {liveLocation && liveLocation.lat !== 0 && order.shippingAddress?.lat && order.shippingAddress?.lng && (
                        <button
                            onClick={handleStartDirection}
                            className="w-full px-4 py-3 bg-app-green hover:bg-app-green-light text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <Navigation2Icon className="w-5 h-5" />
                            {showDirections ? "Directions Started" : "Start Directions"}
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
