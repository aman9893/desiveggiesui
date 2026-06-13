import { type FC, useState } from "react";
import { Bell, CheckCircle, X } from "lucide-react";

interface NotificationPopupProps {
    title: string;
    message: string;
    type?: "success" | "info" | "warning" | "error";
    onActionClick?: () => void;
    actionLabel?: string;
    onClose?: () => void;
    onCloseSound?: () => void;
}

export const NotificationPopup: FC<NotificationPopupProps> = ({
    title,
    message,
    type = "info",
    onActionClick,
    actionLabel = "View",
    onClose,
    onCloseSound,
}) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        onCloseSound?.();
        // Wait for animation to complete before calling onClose
        setTimeout(() => {
            onClose?.();
        }, 300);
    };

    const bgColor = {
        success: "bg-green-50 border-green-200",
        info: "bg-blue-50 border-blue-200",
        warning: "bg-yellow-50 border-yellow-200",
        error: "bg-red-50 border-red-200",
    }[type];

    const textColor = {
        success: "text-green-900",
        info: "text-blue-900",
        warning: "text-yellow-900",
        error: "text-red-900",
    }[type];

    const iconColor = {
        success: "text-green-600",
        info: "text-blue-600",
        warning: "text-yellow-600",
        error: "text-red-600",
    }[type];

    const Icon = type === "success" ? CheckCircle : Bell;

    return (
        <div className={`${bgColor} border rounded-lg p-4 shadow-lg flex gap-3 items-start max-w-md transition-all duration-300 ${
            isClosing ? "opacity-0 scale-95 translate-x-full" : "opacity-100 scale-100 translate-x-0"
        }`}>
            <Icon className={`${iconColor} flex-shrink-0 mt-0.5 h-5 w-5`} />
            <div className="flex-1 min-w-0">
                <h3 className={`${textColor} font-semibold text-sm`}>{title}</h3>
                <p className={`${textColor} text-xs mt-1 opacity-90`}>{message}</p>
                {onActionClick && (
                    <button
                        onClick={onActionClick}
                        className={`mt-2 text-xs font-medium ${
                            type === "success"
                                ? "text-green-700 hover:text-green-800"
                                : "text-blue-700 hover:text-blue-800"
                        } underline`}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
            {onClose && (
                <button
                    onClick={handleClose}
                    className={`flex-shrink-0 mt-0.5 ${
                        type === "success"
                            ? "text-green-500 hover:text-green-700"
                            : type === "info"
                              ? "text-blue-500 hover:text-blue-700"
                              : type === "warning"
                                ? "text-yellow-500 hover:text-yellow-700"
                                : "text-red-500 hover:text-red-700"
                    } transition-colors`}
                    title="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
