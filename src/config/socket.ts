import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Admin listeners
export const onNewOrder = (callback: (data: any) => void) => {
    socket.on("new_order", callback);
    return () => socket.off("new_order", callback);
};

export const onOrderStatusUpdated = (callback: (data: any) => void) => {
    socket.on("order_status_updated", callback);
    return () => socket.off("order_status_updated", callback);
};

// Driver listeners
export const onNewOrderAvailable = (callback: (data: any) => void) => {
    socket.on("new_order_available", callback);
    return () => socket.off("new_order_available", callback);
};

export const onOrderAssigned = (callback: (data: any) => void) => {
    socket.on("order_assigned", callback);
    return () => socket.off("order_assigned", callback);
};

// Customer listeners
export const onOrderPlaced = (callback: (data: any) => void) => {
    socket.on("order_placed", callback);
    return () => socket.off("order_placed", callback);
};

export const onDriverAssigned = (callback: (data: any) => void) => {
    socket.on("driver_assigned", callback);
    return () => socket.off("driver_assigned", callback);
};
