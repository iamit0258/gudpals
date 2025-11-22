import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/ClerkAuthBridge";
import MessageBubble from "@/components/chat/MessageBubble";
import { supabase } from "@/integrations/supabase/client";

const ChatRoom = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const { user } = useAuth();
    const { messages, loading, fetchMessages, sendMessage, subscribeToMessages } = useChat();
    const [messageText, setMessageText] = useState("");
    const [partnerName, setPartnerName] = useState("User");
    const [partnerPhoto, setPartnerPhoto] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user && userId) {
            fetchMessages(userId);
            fetchPartnerProfile();

            // Subscribe to real-time messages
            const unsubscribe = subscribeToMessages(userId);
            return unsubscribe;
        }
    }, [user, userId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchPartnerProfile = async () => {
        if (!userId) return;

        try {
            const { data } = await supabase
                .from("profiles")
                .select("display_name, photo_url")
                .eq("id", userId)
                .single();

            if (data) {
                setPartnerName(data.display_name || "User");
                setPartnerPhoto(data.photo_url);
            }
        } catch (error) {
            console.error("Error fetching partner profile:", error);
        }
    };

    const handleSend = async () => {
        if (!userId || !messageText.trim()) return;

        await sendMessage(userId, messageText);
        setMessageText("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <MobileLayout>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="p-0 text-white" onClick={() => navigate("/chat")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    {/* Partner Info */}
                    <div className="flex items-center gap-2 flex-1">
                        {partnerPhoto ? (
                            <img
                                src={partnerPhoto}
                                alt={partnerName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                {partnerName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h1 className="text-lg font-bold">{partnerName}</h1>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 pb-20 overflow-y-auto">
                {loading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg.message}
                                isSent={msg.sender_id === user?.uid}
                                timestamp={msg.created_at}
                                isRead={msg.is_read}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
                <div className="flex gap-2">
                    <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!messageText.trim()}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
};

export default ChatRoom;
