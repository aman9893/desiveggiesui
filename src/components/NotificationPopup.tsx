import { type FC } from "react";
import { Bell, CheckCircle } from "lucide-react";

interface NotificationPopupProps {
    title: string;
    message: string;
    type?: "success" | "info" | "warning" | "error";
    onActionClick?: () => void;
    actionLabel?: string;
}

export const NotificationPopup: FC<NotificationPopupProps> = ({
    title,
    message,
    type = "info",
    onActionClick,
    actionLabel = "View",
}) => {
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
        <div className={`${bgColor} border rounded-lg p-4 shadow-lg flex gap-3 items-start max-w-md`}>
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
        </div>
    );
};
