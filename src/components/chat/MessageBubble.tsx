import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
    message: string;
    isSent: boolean;
    timestamp: string;
    isRead?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSent, timestamp, isRead }) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className={cn("flex mb-4", isSent ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[70%] rounded-2xl px-4 py-2", isSent ? "bg-primary text-white" : "bg-gray-100 text-gray-900")}>
                <p className="text-sm break-words">{message}</p>
                <div className={cn("flex items-center gap-1 mt-1", isSent ? "justify-end" : "justify-start")}>
                    <span className={cn("text-xs", isSent ? "text-white/70" : "text-gray-500")}>
                        {formatTime(timestamp)}
                    </span>
                    {isSent && (
                        <span className="text-xs text-white/70">
                            {isRead ? "✓✓" : "✓"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
