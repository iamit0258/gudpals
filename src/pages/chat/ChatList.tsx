import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/ClerkAuthBridge";

const ChatList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { conversations, loading, fetchConversations } = useChat();

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <MobileLayout>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4">
                <Button variant="ghost" className="p-0 text-white mb-2" onClick={() => navigate("/friends")}>
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back
                </Button>
                <h1 className="text-xl font-bold">Messages</h1>
            </div>

            {/* Conversations List */}
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No messages yet</h3>
                        <p className="text-sm text-gray-500">Start a conversation with your friends!</p>
                        <Button className="mt-4" onClick={() => navigate("/friends")}>
                            Go to Friends
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((conv) => (
                            <Card
                                key={conv.userId}
                                className="cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => navigate(`/chat/${conv.userId}`)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="relative">
                                            {conv.userPhoto ? (
                                                <img
                                                    src={conv.userPhoto}
                                                    alt={conv.userName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                                                    {conv.userName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            {conv.unreadCount > 0 && (
                                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-medium text-gray-900 truncate">{conv.userName}</h3>
                                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                    {formatTime(conv.lastMessageTime)}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"}`}>
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </MobileLayout>
    );
};

export default ChatList;
