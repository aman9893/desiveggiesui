import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PackageIcon, X, Bike } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../config/api";
import type { Order } from "../../types";

const RecentOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const { data } = await api.get("/orders");
                setOrders(data.orders || []);
            } catch (error) {
                setOrders([]);
            }
        };

        fetchOrders();
    }, [user]);

    // Check if all orders are delivered
    const allOrdersDelivered = orders.length > 0 && orders.every((order) => order.status === "Delivered");

    // Don't show if user is not logged in, hidden, no orders, or all orders delivered
    if (!user || !isVisible || orders.length === 0 || allOrdersDelivered) {
        return null;
    }

    return (
        <section className="fixed bottom-15 left-0 right-0 z-40 py-2 px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(`/orders/${orders[0].id}`)}
                    style={{
                        backgroundColor: "#ff8936",
                        borderColor: "#ff8936",
                    }}
                    className="w-full hover:opacity-90 rounded-lg p-0 transition-all border-2 cursor-pointer group flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bike className="size-5 text-white flex-shrink-0" />
                        </div>
                        <span className="text-sm font-semibold text-white">Recent Orders</span>
                    </div>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsVisible(false);
                        }}
                        className="p-1 hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                    >
                        <X className="size-4 text-white" />
                    </button>
                </button>
            </div>
        </section>
    );
};

export default RecentOrders;
