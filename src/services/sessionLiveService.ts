import { supabase } from "@/integrations/supabase/client";

export const sessionLiveService = {
    // Start a live session
    startLiveSession: async (sessionId: string, channelName: string, token: string) => {
        const { error } = await supabase
            .from('activities' as any)
            .update({
                is_live: true,
                agora_channel: channelName,
                agora_token: token
            })
            .eq('id', sessionId);

        if (error) throw error;
    },

    // Stop a live session
    stopLiveSession: async (sessionId: string) => {
        const { error } = await supabase
            .from('activities' as any)
            .update({
                is_live: false,
                agora_channel: null,
                agora_token: null
            })
            .eq('id', sessionId);

        if (error) throw error;
    },

    // Send a chat message
    sendMessage: async (sessionId: string, userId: string, message: string) => {
        const { error } = await supabase
            .from('session_chats' as any)
            .insert({
                session_id: sessionId,
                user_id: userId,
                message: message
            });

        if (error) throw error;
    },

    // Get chat messages (initial load)
    getMessages: async (sessionId: string) => {
        const { data, error } = await supabase
            .from('session_chats' as any)
            .select(`
        *,
        user:profiles(display_name, photo_url)
      `)
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    }
};
