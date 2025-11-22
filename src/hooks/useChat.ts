import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";
import { useToast } from "@/hooks/use-toast";

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface Conversation {
    userId: string;
    userName: string;
    userPhoto: string | null;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

export const useChat = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch all conversations
    const fetchConversations = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Get all messages where user is sender or receiver
            const { data: allMessages, error } = await supabase
                .from("chat_messages")
                .select("*")
                .or(`sender_id.eq.${user.uid},receiver_id.eq.${user.uid}`)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Group messages by conversation partner
            const conversationMap = new Map<string, Conversation>();

            for (const msg of allMessages || []) {
                const partnerId = msg.sender_id === user.uid ? msg.receiver_id : msg.sender_id;

                if (!conversationMap.has(partnerId)) {
                    // Fetch partner's profile
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("display_name, photo_url")
                        .eq("id", partnerId)
                        .single();

                    // Count unread messages from this partner
                    const unreadCount = allMessages.filter(
                        m => m.sender_id === partnerId && m.receiver_id === user.uid && !m.is_read
                    ).length;

                    conversationMap.set(partnerId, {
                        userId: partnerId,
                        userName: profile?.display_name || "Unknown User",
                        userPhoto: profile?.photo_url || null,
                        lastMessage: msg.message,
                        lastMessageTime: msg.created_at,
                        unreadCount,
                    });
                }
            }

            setConversations(Array.from(conversationMap.values()));
        } catch (error: any) {
            console.error("Error fetching conversations:", error);
            toast({
                title: "Error",
                description: "Failed to load conversations",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch messages for a specific conversation
    const fetchMessages = async (partnerId: string) => {
        if (!user) return;

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("chat_messages")
                .select("*")
                .or(`and(sender_id.eq.${user.uid},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.uid})`)
                .order("created_at", { ascending: true });

            if (error) throw error;

            setMessages(data || []);

            // Mark messages as read
            await markMessagesAsRead(partnerId);
        } catch (error: any) {
            console.error("Error fetching messages:", error);
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Send a message
    const sendMessage = async (receiverId: string, messageText: string) => {
        if (!user || !messageText.trim()) return;

        try {
            const { error } = await supabase
                .from("chat_messages")
                .insert({
                    sender_id: user.uid,
                    receiver_id: receiverId,
                    message: messageText.trim(),
                    is_read: false,
                });

            if (error) throw error;

            // Refresh messages
            await fetchMessages(receiverId);
        } catch (error: any) {
            console.error("Error sending message:", error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        }
    };

    // Mark messages as read
    const markMessagesAsRead = async (senderId: string) => {
        if (!user) return;

        try {
            await supabase
                .from("chat_messages")
                .update({ is_read: true })
                .eq("sender_id", senderId)
                .eq("receiver_id", user.uid)
                .eq("is_read", false);
        } catch (error: any) {
            console.error("Error marking messages as read:", error);
        }
    };

    // Subscribe to real-time messages
    const subscribeToMessages = (partnerId: string) => {
        if (!user) return;

        const channel = supabase
            .channel(`chat:${user.uid}:${partnerId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `receiver_id=eq.${user.uid}`,
                },
                (payload) => {
                    if (payload.new.sender_id === partnerId) {
                        setMessages((prev) => [...prev, payload.new as Message]);
                        markMessagesAsRead(partnerId);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    return {
        conversations,
        messages,
        loading,
        fetchConversations,
        fetchMessages,
        sendMessage,
        subscribeToMessages,
    };
};
