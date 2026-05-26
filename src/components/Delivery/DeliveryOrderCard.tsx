import { CheckCircleIcon, ClockIcon, MapPinIcon, PhoneIcon, TruckIcon, XCircleIcon, Navigation2Icon, ChevronDownIcon, MessageCircleIcon } from "lucide-react";
import type { Order } from "../../types";
import { statusColors } from "../../assets/assets";
import { useState } from "react";
import LiveMap from "../OrderTracking/LiveMap";

interface DeliveryOrderCardProps {
    order: Order;
    tab: "active" | "completed";
    handleUpdateStatus: (orderId: string, status: string) => void;
    setOtpModal: (orderId: string) => void;
    setCancelModal: (orderId: string) => void;
    liveLocation?: { lat: number; lng: number } | null;
}

export default function DeliveryOrderCard({ order, tab, handleUpdateStatus, setOtpModal, setCancelModal, liveLocation }: DeliveryOrderCardProps) {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";
    const [showMap, setShowMap] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const user = typeof order.user === "object" ? order.user : { name: "Customer", email: "", phone: "" };

    // Generate direction URL
    const generateDirectionUrl = () => {
        if (!order.shippingAddress) return "";
        
        const destination = `${order.shippingAddress.lat},${order.shippingAddress.lng}`;
        
        // If we have live location, use it as origin
        if (liveLocation) {
            const origin = `${liveLocation.lat},${liveLocation.lng}`;
            const userAgent = navigator.userAgent;
            
            if (/iPhone|iPad|iPod/.test(userAgent)) {
                return `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`;
            } else {
                return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
            }
        } else {
            // Fallback: just show destination
            const userAgent = navigator.userAgent;
            
            if (/iPhone|iPad|iPod/.test(userAgent)) {
                return `https://maps.apple.com/?daddr=${destination}&dirflg=d`;
            } else {
                return `https://www.google.com/maps/search/?api=1&query=${destination}`;
            }
        }
    };

    const handleStartDirection = () => {
        const directionUrl = generateDirectionUrl();
        if (directionUrl) {
            window.open(directionUrl, "_blank");
        }
    };

    const handleWhatsApp = () => {
        if (!user.phone) return;
        // Remove any spaces, dashes, or special characters from phone
        const cleanPhone = user.phone.replace(/\D/g, "");
        // Remove leading 0 if present (common in some regions)
        const finalPhone = cleanPhone.startsWith("0") ? cleanPhone.slice(1) : cleanPhone;
        const whatsappUrl = `https://wa.me/${finalPhone}?text=hii`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <div key={order.id} className="bg-white rounded-2xl border border-app-border overflow-hidden">
            {/* Header - Clickable */}
            <div 
                onClick={() => setShowDetails(!showDetails)}
                className="px-5 py-4 border-b border-app-border flex items-center justify-between cursor-pointer hover:bg-zinc-50/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-zinc-500">#{order.id.slice(-6).toUpperCase()}</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || "bg-zinc-100 text-zinc-600"}`}>{order.status}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-zinc-900">
                        {currency}
                        {order.total.toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-500">{showDetails ? "▼" : "▶"}</span>
                </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
                {/* Customer */}
                <div className="flex items-center gap-2 text-sm">
                    <div className="size-8 rounded-full bg-app-cream flex-center">
                        <span className="text-xs font-semibold text-app-green">{user.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-zinc-900">{user.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {user.phone && (
                                <>
                                    <a 
                                        href={`tel:${user.phone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <PhoneIcon className="size-3" /> {user.phone}
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWhatsApp();
                                        }}
                                        className="p-1 hover:bg-green-100 rounded transition-colors"
                                        title="Chat on WhatsApp"
                                    >
                                        <MessageCircleIcon className="size-3.5 text-green-600" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-zinc-600">
                    <MapPinIcon className="size-4 text-app-green shrink-0 mt-0.5" />
                    <p>
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    </p>
                </div>

                {/* Items count */}
                <p className="text-xs text-zinc-500">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.paymentMethod.toUpperCase()}
                </p>

                {/* Expanded Details */}
                {showDetails && (
                    <div className="pt-3 border-t border-app-border space-y-3">
                        {/* Items List */}
                        <div>
                            <h4 className="text-xs font-semibold text-zinc-600 mb-2 uppercase">Items</h4>
                            <div className="space-y-1.5">
                                {order.items.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between text-xs">
                                        <span className="text-zinc-600">{item.product?.name || "Item"} × {item.quantity}</span>
                                        <span className="font-medium">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="border-t border-app-border pt-3">
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-zinc-600">
                                    <span>Subtotal</span>
                                    <span>{currency}{order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                                </div>
                                {order.deliveryFee > 0 && (
                                    <div className="flex justify-between text-zinc-600">
                                        <span>Delivery</span>
                                        <span>{currency}{order.deliveryFee?.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-medium text-zinc-900 pt-1.5 border-t border-app-border">
                                    <span>Total</span>
                                    <span>{currency}{order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Contact Info */}
                        <div className="border-t border-app-border pt-3">
                            <h4 className="text-xs font-semibold text-zinc-600 mb-2 uppercase">Contact</h4>
                            <div className="space-y-1.5 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-600">Name:</span>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-600">Phone:</span>
                                        <div className="flex items-center gap-1.5">
                                            <a 
                                                href={`tel:${user.phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                {user.phone}
                                            </a>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWhatsApp();
                                                }}
                                                className="p-1 hover:bg-green-100 rounded transition-colors"
                                                title="Chat on WhatsApp"
                                            >
                                                <MessageCircleIcon className="size-3.5 text-green-600" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {user.email && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-600">Email:</span>
                                        <a 
                                            href={`mailto:${user.email}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="font-medium text-blue-600 hover:underline truncate"
                                        >
                                            {user.email}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Map View */}
                {tab === "active" && (
                    <div className="pt-2 border-t border-app-border">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMap(!showMap);
                            }}
                            className="w-full px-3 py-2 text-sm font-medium bg-app-green/10 text-app-green rounded-lg hover:bg-app-green/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <MapPinIcon className="w-4 h-4" />
                            {showMap ? "Hide" : "View"} Live Location
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showMap ? "rotate-180" : ""}`} />
                        </button>

                        {showMap && (
                            <div className="mt-3">
                                <LiveMap order={order} liveLocation={liveLocation} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            {tab === "active" && (
                <div className="px-5 py-3 border-t border-app-border flex flex-wrap gap-2">
                    {order.shippingAddress?.lat && order.shippingAddress?.lng && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStartDirection();
                            }}
                            className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                        >
                            <Navigation2Icon className="w-3.5 h-3.5" />
                            Directions
                        </button>
                    )}
                    {(order.status === "Assigned" || order.status === "Packed") && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(order.id, order.status === "Assigned" ? "Packed" : "Out for Delivery");
                            }} 
                            className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                        >
                            <TruckIcon className="w-3.5 h-3.5" />
                            {order.status === "Assigned" ? "Mark Packed" : "Out for Delivery"}
                        </button>
                    )}
                    {order.status === "Out for Delivery" && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setOtpModal(order.id);
                            }} 
                            className="px-4 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-1.5"
                        >
                            <CheckCircleIcon className="w-3.5 h-3.5" /> Mark Delivered
                        </button>
                    )}
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setCancelModal(order.id);
                            }} 
                            className="px-4 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1.5"
                        >
                            <XCircleIcon className="w-3.5 h-3.5" /> Cancel
                        </button>
                    )}
                </div>
            )}

            {tab === "completed" && (
                <div className="px-5 py-3 border-t border-app-border">
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                </div>
            )}
        </div>
    );
}
