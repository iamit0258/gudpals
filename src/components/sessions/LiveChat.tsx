import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { sessionLiveService } from "@/services/sessionLiveService";

interface LiveChatProps {
    sessionId: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ sessionId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load initial messages
        const loadMessages = async () => {
            try {
                const data = await sessionLiveService.getMessages(sessionId);
                setMessages(data || []);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        };

        loadMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`session_chat:${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'session_chats',
                    filter: `session_id=eq.${sessionId}`
                },
                async (payload) => {
                    // Fetch the full message with user profile
                    const { data, error } = await supabase
                        .from('session_chats')
                        .select(`
              *,
              user:profiles(display_name, photo_url)
            `)
                        .eq('id', payload.new.id)
                        .single();

                    if (!error && data) {
                        setMessages(prev => [...prev, data]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId]);

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await sessionLiveService.sendMessage(sessionId, user.uid, newMessage.trim());
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
            <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-sm">Live Chat</h3>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-2">
                            <Avatar className="w-6 h-6 mt-1">
                                <AvatarImage src={msg.user?.photo_url} />
                                <AvatarFallback className="text-[10px]">
                                    {msg.user?.display_name?.substring(0, 2).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-gray-500">
                                    {msg.user?.display_name || "Unknown"}
                                </p>
                                <p className="text-sm bg-gray-100 rounded-lg p-2 mt-1 inline-block">
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Say something..."
                    className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default LiveChat;
