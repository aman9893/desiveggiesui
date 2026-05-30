import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, TruckIcon, MapPinIcon, PhoneIcon, MailIcon, Navigation2Icon, ChevronDownIcon } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import LiveMap from "../../components/OrderTracking/LiveMap";

export default function AdminOrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [activeTab, setActiveTab] = useState("items");
    const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showLiveTracking, setShowLiveTracking] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // Refetch order details when page gets focus (navigating back)
    useEffect(() => {
        const handleFocus = () => {
            fetchOrderDetails();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [orderId]);

    // Fetch live location for the order
    useEffect(() => {
        if (!order || ["Delivered", "Cancelled", "Placed"].includes(order.status)) return;

        const fetchLocation = async () => {
            try {
                const { data } = await api.get(`/orders/${orderId}/location`);
                if (data.liveLocation?.lat && data.liveLocation?.lng) {
                    setLiveLocation({
                        lat: data.liveLocation.lat,
                        lng: data.liveLocation.lng,
                    });
                }
            } catch {}
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, [orderId, order?.status]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await api.get(`/orders/${orderId}`);
            setOrder(data.order);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load order details", { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success("Order status updated", { duration: 3000 });
            fetchOrderDetails();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status", { duration: 3000 });
        } finally {
            setUpdatingStatus(false);
        }
    };

    const statusOptions = ["Placed", "Confirmed", "Assigned", "Packed", "Out for Delivery", "Delivered", "Cancelled"];
    const statusColors: any = {
        Placed: "bg-blue-100 text-blue-800",
        Confirmed: "bg-amber-100 text-amber-800",
        Assigned: "bg-indigo-100 text-indigo-800",
        Packed: "bg-cyan-100 text-cyan-800",
        "Out for Delivery": "bg-purple-100 text-purple-800",
        Delivered: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    const generateDirectionUrl = () => {
        if (!liveLocation || !order?.shippingAddress?.lat || !order?.shippingAddress?.lng) return "";
        
        const origin = `${liveLocation.lat},${liveLocation.lng}`;
        const destination = `${order.shippingAddress.lat},${order.shippingAddress.lng}`;
        
        const userAgent = navigator.userAgent;
        if (/iPhone|iPad|iPod/.test(userAgent)) {
            return `https://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`;
        } else {
            return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        }
    };

    const handleStartDirections = () => {
        const directionUrl = generateDirectionUrl();
        if (directionUrl) {
            window.open(directionUrl, "_blank");
        }
    };

    if (loading) return <Loading />;
    if (!order) return <div className="text-center py-8 text-zinc-500">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-3 md:py-6">
            <div className="max-w-4xl mx-auto px-3 md:px-4">
                {/* Header */}
                <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
                    <button
                        onClick={() => navigate("/admin/orders")}
                        className="p-1 md:p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-zinc-700" />
                    </button>
                    <div>
                        <h1 className="text-sm md:text-lg font-bold text-zinc-900">Order Details</h1>
                        <p className="text-xs md:text-sm text-zinc-500">#{order.id.slice(-6)}</p>
                    </div>
                </div>

                {/* Mobile Tabs */}
                <div className="lg:hidden mb-3 md:mb-6 flex gap-0 border-b border-gray-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("items")}
                        className={`px-2 md:px-4 py-2 md:py-3 font-medium text-xs md:text-sm border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "items"
                                ? "border-app-green text-app-green"
                                : "border-transparent text-zinc-600 hover:text-zinc-900"
                        }`}
                    >
                        Items
                    </button>
                    <button
                        onClick={() => setActiveTab("address")}
                        className={`px-2 md:px-4 py-2 md:py-3 font-medium text-xs md:text-sm border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "address"
                                ? "border-app-green text-app-green"
                                : "border-transparent text-zinc-600 hover:text-zinc-900"
                        }`}
                    >
                        Address
                    </button>
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`px-2 md:px-4 py-2 md:py-3 font-medium text-xs md:text-sm border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === "info"
                                ? "border-app-green text-app-green"
                                : "border-transparent text-zinc-600 hover:text-zinc-900"
                        }`}
                    >
                        Info
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-3 md:space-y-6">
                        {/* Order Status - Always Visible */}
                        <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-app-border p-3 md:p-6">
                            <h2 className="text-sm md:text-lg font-semibold text-zinc-900 mb-2 md:mb-4">Order Status</h2>
                            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                                <div className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm ${statusColors[order.status] || "bg-zinc-100 text-zinc-800"}`}>
                                    {order.status}
                                </div>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={updatingStatus}
                                    className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-zinc-300 text-xs md:text-sm font-medium outline-none focus:ring-2 focus:ring-app-green/30 disabled:opacity-50"
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Live Location Map - Accordion */}
                        {order.deliveryPartner && (
                            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-app-border p-3 md:p-6">
                                <button
                                    onClick={() => setShowLiveTracking(!showLiveTracking)}
                                    className="w-full flex items-center justify-between mb-2 md:mb-4 hover:opacity-70 transition-opacity"
                                >
                                    <h2 className="text-sm md:text-lg font-semibold text-zinc-900">Live Delivery Tracking</h2>
                                    <ChevronDownIcon 
                                        className={`w-5 h-5 text-zinc-600 transition-transform duration-300 ${showLiveTracking ? "rotate-180" : ""}`}
                                    />
                                </button>
                                
                                {/* Expandable Content */}
                                {showLiveTracking && (
                                    <div className="space-y-3 md:space-y-4">
                                        <LiveMap order={order} liveLocation={liveLocation} />
                                        
                                        {/* Directions Button */}
                                        {order?.shippingAddress?.lat && order?.shippingAddress?.lng && order.status !== "Delivered" && order.status !== "Cancelled" && (
                                            <button
                                                onClick={handleStartDirections}
                                                className="w-full bg-app-green text-white font-semibold py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-app-green-light transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                                            >
                                                <Navigation2Icon className="w-4 h-4 md:w-5 md:h-5" />
                                                View on Map & Get Directions
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Items Tab - Mobile & Desktop */}
                        <div className={`${activeTab !== "items" && "lg:block hidden"}`}>
                            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-app-border p-3 md:p-6">
                                <h2 className="text-sm md:text-lg font-semibold text-zinc-900 mb-2 md:mb-4">Order Items</h2>
                                <div className="space-y-2 md:space-y-4">
                                    {order.items?.map((item: any) => (
                                        <div key={item.id} className="flex items-start gap-2 md:gap-4 pb-2 md:pb-4 border-b border-gray-200 last:border-b-0">
                                            <img
                                                src={item.product?.image || item.image}
                                                alt={item.product?.name || item.name}
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-xs md:text-base text-zinc-900 truncate">{item.product?.name || item.name}</p>
                                                <p className="text-xs md:text-sm text-zinc-500">{item.product?.unit || item.unit}</p>
                                                <p className="text-xs md:text-sm font-medium text-zinc-700">
                                                    {currency}
                                                    {item.price?.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-xs md:text-base text-zinc-900 flex-shrink-0">
                                                {currency}
                                                {(item.price * item.quantity)?.toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Address Tab - Mobile & Desktop */}
                        <div className={`${activeTab !== "address" && "lg:block hidden"}`}>
                            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-app-border p-3 md:p-6">
                                <div className="flex items-center gap-2 mb-2 md:mb-4">
                                    <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-app-green flex-shrink-0" />
                                    <h2 className="text-sm md:text-lg font-semibold text-zinc-900">Delivery Address</h2>
                                </div>
                                <div className="bg-app-cream/50 rounded-lg md:rounded-xl p-2 md:p-4 mb-3 md:mb-6">
                                    <p className="font-medium text-xs md:text-base text-zinc-900 mb-1 md:mb-2">{order.deliveryAddress?.label || order.shippingAddress?.label}</p>
                                    <p className="text-xs md:text-sm text-zinc-600 mb-0.5 md:mb-1">{order.deliveryAddress?.address || order.shippingAddress?.address}</p>
                                    <p className="text-xs md:text-sm text-zinc-600 mb-0.5 md:mb-1">
                                        {order.deliveryAddress?.city || order.shippingAddress?.city}, {order.deliveryAddress?.state || order.shippingAddress?.state} {order.deliveryAddress?.zip || order.shippingAddress?.zip}
                                    </p>
                                    <p className="text-xs md:text-sm font-medium text-zinc-700 mt-1.5 md:mt-3">
                                        <span className="text-zinc-500">Phone: </span>
                                        {order.user?.phone || "N/A"}
                                    </p>
                                </div>

                                {/* Delivery Partner - Inside Address Tab on Mobile */}
                                {order.deliveryPartner && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 md:mb-4">
                                            <TruckIcon className="w-4 h-4 md:w-5 md:h-5 text-app-green flex-shrink-0" />
                                            <h3 className="text-sm md:text-lg font-semibold text-zinc-900">Delivery Partner</h3>
                                        </div>
                                        <div className="flex items-start gap-2 md:gap-4 bg-app-cream/50 rounded-lg md:rounded-xl p-2 md:p-4">
                                            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-app-green flex-center text-white font-semibold text-xs md:text-lg flex-shrink-0">
                                                {order.deliveryPartner.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-xs md:text-base text-zinc-900 truncate">{order.deliveryPartner.name}</p>
                                                <p className="text-xs md:text-sm text-zinc-600">{order.deliveryPartner.vehicleType}</p>
                                                <p className="text-xs md:text-sm text-zinc-600 flex items-center gap-1 mt-0.5 md:mt-1">
                                                    <PhoneIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                                    <span className="truncate">{order.deliveryPartner.phone}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Tab - Mobile Only */}
                        <div className={`lg:hidden ${activeTab !== "info" && "hidden"}`}>
                            {/* Customer Info - Mobile */}
                            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-app-border p-3 md:p-6 mb-3 md:mb-6">
                                <h3 className="text-sm md:text-lg font-semibold text-zinc-900 mb-2 md:mb-4">Customer Info</h3>
                                <div className="space-y-2 md:space-y-4">
                                    <div>
                                        <p className="text-xs md:text-sm text-zinc-500 mb-0.5 md:mb-1">Name</p>
                                        <p className="font-medium text-xs md:text-base text-zinc-900">{order.user?.name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm text-zinc-500 mb-0.5 md:mb-1 flex items-center gap-1">
                                            <MailIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                            Email
                                        </p>
                                        <p className="font-medium text-xs md:text-base text-zinc-900 break-all">{order.user?.email || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs md:text-sm text-zinc-500 mb-0.5 md:mb-1 flex items-center gap-1">
                                            <PhoneIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                            Phone
                                        </p>
                                        <p className="font-medium text-xs md:text-base text-zinc-900">{order.user?.phone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary - Mobile */}
                            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-app-border p-3 md:p-6 mb-3 md:mb-6">
                                <h3 className="text-sm md:text-lg font-semibold text-zinc-900 mb-2 md:mb-4">Order Summary</h3>
                                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600">Subtotal</span>
                                        <span className="font-medium text-zinc-900">
                                            {currency}
                                            {(order.total - (order.tax || 0) - (order.discount || 0) - (order.deliveryFee || 0))?.toFixed(2) || order.subtotal?.toFixed(2)}
                                        </span>
                                    </div>
                                    {(order.discount || 0) > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span className="font-medium">-{currency}{order.discount?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {(order.deliveryFee || 0) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600">Delivery Fee</span>
                                            <span className="font-medium text-zinc-900">
                                                {currency}
                                                {order.deliveryFee?.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {(order.tax || 0) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600">Tax</span>
                                            <span className="font-medium text-zinc-900">
                                                {currency}
                                                {order.tax?.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="border-t pt-2 md:pt-3 flex justify-between">
                                        <span className="font-semibold text-zinc-900">Total</span>
                                        <span className="font-bold text-app-green">
                                            {currency}
                                            {order.total?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Info - Mobile */}
                            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-app-border p-3 md:p-6">
                                <h3 className="text-sm md:text-lg font-semibold text-zinc-900 mb-2 md:mb-4">Order Info</h3>
                                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                                    <div>
                                        <p className="text-zinc-500 mb-0.5 md:mb-1">Order ID</p>
                                        <p className="font-medium text-zinc-900 break-all">{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 mb-0.5 md:mb-1">Placed On</p>
                                        <p className="font-medium text-zinc-900">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {order.paymentMethod && (
                                        <div>
                                            <p className="text-zinc-500 mb-0.5 md:mb-1">Payment Method</p>
                                            <p className="font-medium text-zinc-900 capitalize">{order.paymentMethod}</p>
                                        </div>
                                    )}
                                    {order.deliveryOtp && (
                                        <div>
                                            <p className="text-zinc-500 mb-0.5 md:mb-1">Delivery OTP</p>
                                            <p className="font-medium text-lg text-app-green">{order.deliveryOtp}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Delivery Partner - Desktop Only */}
                        <div className="hidden lg:block">
                            {order.deliveryPartner && (
                                <div className="bg-white rounded-2xl shadow-sm border border-app-border p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TruckIcon className="w-5 h-5 text-app-green" />
                                        <h2 className="text-lg font-semibold text-zinc-900">Delivery Partner</h2>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 rounded-full bg-app-green flex-center text-white font-semibold text-lg flex-shrink-0">
                                            {order.deliveryPartner.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-900">{order.deliveryPartner.name}</p>
                                            <p className="text-sm text-zinc-600">{order.deliveryPartner.vehicleType}</p>
                                            <p className="text-sm text-zinc-600 flex items-center gap-1 mt-1">
                                                <PhoneIcon className="w-4 h-4" />
                                                {order.deliveryPartner.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Desktop Only */}
                    <div className="hidden lg:block space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-app-border p-6">
                            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Customer Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Name</p>
                                    <p className="font-medium text-zinc-900">{order.user?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1">
                                        <MailIcon className="w-4 h-4" />
                                        Email
                                    </p>
                                    <p className="font-medium text-zinc-900 break-all">{order.user?.email || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1 flex items-center gap-1">
                                        <PhoneIcon className="w-4 h-4" />
                                        Phone
                                    </p>
                                    <p className="font-medium text-zinc-900">{order.user?.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-app-border p-6">
                            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-600">Subtotal</span>
                                    <span className="font-medium text-zinc-900">
                                        {currency}
                                        {(order.total - (order.tax || 0) - (order.discount || 0) - (order.deliveryFee || 0))?.toFixed(2) || order.subtotal?.toFixed(2)}
                                    </span>
                                </div>
                                {(order.discount || 0) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-{currency}{order.discount?.toFixed(2)}</span>
                                    </div>
                                )}
                                {(order.deliveryFee || 0) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600">Delivery Fee</span>
                                        <span className="font-medium text-zinc-900">
                                            {currency}
                                            {order.deliveryFee?.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {(order.tax || 0) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600">Tax</span>
                                        <span className="font-medium text-zinc-900">
                                            {currency}
                                            {order.tax?.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-semibold text-zinc-900">Total</span>
                                    <span className="font-bold text-lg text-app-green">
                                        {currency}
                                        {order.total?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-app-border p-6">
                            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Order Info</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-zinc-500 mb-1">Order ID</p>
                                    <p className="font-medium text-zinc-900 break-all">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 mb-1">Placed On</p>
                                    <p className="font-medium text-zinc-900">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {order.paymentMethod && (
                                    <div>
                                        <p className="text-zinc-500 mb-1">Payment Method</p>
                                        <p className="font-medium text-zinc-900 capitalize">{order.paymentMethod}</p>
                                    </div>
                                )}
                                {order.deliveryOtp && (
                                    <div>
                                        <p className="text-zinc-500 mb-1">Delivery OTP</p>
                                        <p className="font-medium text-lg text-app-green">{order.deliveryOtp}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
