import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  message: string | null;
  created_at: string;
  profiles?: {
    display_name: string;
    photo_url: string;
  };
}

interface Connection {
  id: string;
  user_id_1: string;
  user_id_2: string;
  connected_at: string;
  profiles?: {
    display_name: string;
    photo_url: string;
  };
}

export const useFriendsService = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFriendRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          profiles!sender_id (
            display_name,
            photo_url
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching friend requests:", error);
        // If the foreign key doesn't work, fetch without profiles for now
        const { data: simpleData, error: simpleError } = await supabase
          .from('friend_requests')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        
        if (simpleError) throw simpleError;
        setFriendRequests(simpleData || []);
        return;
      }
      
      // Transform the data to match our interface with proper null checks
      const transformedData = data?.map(request => {
        // Safely check if profiles exists and has the required properties
        const hasValidProfiles = request.profiles && 
                                request.profiles !== null &&
                                typeof request.profiles === 'object' && 
                                'display_name' in request.profiles &&
                                'photo_url' in request.profiles;
        
        return {
          ...request,
          profiles: hasValidProfiles ? {
            display_name: request.profiles?.display_name || '',
            photo_url: request.profiles?.photo_url || ''
          } : undefined
        };
      }) || [];
      
      setFriendRequests(transformedData);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const fetchConnections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          profiles!user_id_1 (
            display_name,
            photo_url
          )
        `)
        .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
        .order('connected_at', { ascending: false });

      if (error) {
        console.error("Error fetching connections:", error);
        // If the foreign key doesn't work, fetch without profiles for now
        const { data: simpleData, error: simpleError } = await supabase
          .from('user_connections')
          .select('*')
          .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
          .order('connected_at', { ascending: false });
        
        if (simpleError) throw simpleError;
        setConnections(simpleData || []);
        return;
      }
      
      // Transform the data to match our interface with proper null checks
      const transformedData = data?.map(connection => {
        // Safely check if profiles exists and has the required properties
        const hasValidProfiles = connection.profiles && 
                                connection.profiles !== null &&
                                typeof connection.profiles === 'object' && 
                                'display_name' in connection.profiles &&
                                'photo_url' in connection.profiles;
        
        return {
          ...connection,
          profiles: hasValidProfiles ? {
            display_name: connection.profiles?.display_name || '',
            photo_url: connection.profiles?.photo_url || ''
          } : undefined
        };
      }) || [];
      
      setConnections(transformedData);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (receiverId: string, message?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const response = await supabase.functions.invoke('manage-friend-request', {
        body: { action: 'send', receiverId, message },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Friend Request Sent",
        description: "Your friend request has been sent successfully",
      });

      return response.data;
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const respondToFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const response = await supabase.functions.invoke('manage-friend-request', {
        body: { action, requestId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: action === 'accept' ? "Friend Request Accepted" : "Friend Request Rejected",
        description: `You have ${action}ed the friend request`,
      });

      // Refresh data
      fetchFriendRequests();
      if (action === 'accept') {
        fetchConnections();
      }

      return response.data;
    } catch (error) {
      console.error("Error responding to friend request:", error);
      toast({
        title: "Error",
        description: "Failed to respond to friend request",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFriendRequests();
    fetchConnections();
  }, []);

  return {
    friendRequests,
    connections,
    loading,
    sendFriendRequest,
    respondToFriendRequest,
    refetchRequests: fetchFriendRequests,
    refetchConnections: fetchConnections,
  };
};
