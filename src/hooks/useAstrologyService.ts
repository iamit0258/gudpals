
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Astrologer {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  rate_per_minute: number;
  is_available: boolean;
  rating: number;
  total_consultations: number;
  profiles?: {
    display_name: string;
    photo_url: string;
  };
}

interface Consultation {
  id: string;
  user_id: string;
  astrologer_id: string;
  consultation_type: string;
  status: string;
  duration_minutes: number;
  total_cost: number;
  payment_status: string;
  started_at: string;
  ended_at: string;
  created_at: string;
  astrologers?: Astrologer;
}

interface ChatMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  message: string;
  message_type: string;
  created_at: string;
}

export const useAstrologyService = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAstrologers = async () => {
    try {
      setLoading(true);

      // Simplified query without complex joins to avoid relation errors
      const { data, error } = await supabase
        .from('astrologers')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) {
        console.error("Error fetching astrologers:", error);
        throw error;
      }

      // Fetch profiles separately to avoid foreign key issues
      const astrologersWithProfiles = await Promise.all(
        (data || []).map(async (astrologer) => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, photo_url')
              .eq('id', astrologer.user_id)
              .single();

            return {
              ...astrologer,
              profiles: profile ? {
                display_name: profile.display_name || '',
                photo_url: profile.photo_url || ''
              } : undefined
            };
          } catch (profileError) {
            console.error("Error fetching profile for astrologer:", profileError);
            return astrologer;
          }
        })
      );

      setAstrologers(astrologersWithProfiles);
    } catch (error) {
      console.error("Error fetching astrologers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch astrologers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simplified query without complex joins
      const { data, error } = await supabase
        .from('astrology_consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching consultations:", error);
        throw error;
      }

      // Fetch astrologer data and profiles separately
      const consultationsWithDetails = await Promise.all(
        (data || []).map(async (consultation) => {
          try {
            // Fetch astrologer data
            const { data: astrologer } = await supabase
              .from('astrologers')
              .select('*')
              .eq('id', consultation.astrologer_id)
              .single();

            if (astrologer) {
              // Fetch profile for the astrologer
              const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, photo_url')
                .eq('id', astrologer.user_id)
                .single();

              return {
                ...consultation,
                astrologers: {
                  ...astrologer,
                  profiles: profile ? {
                    display_name: profile.display_name || '',
                    photo_url: profile.photo_url || ''
                  } : undefined
                }
              };
            }

            return consultation;
          } catch (detailError) {
            console.error("Error fetching consultation details:", detailError);
            return consultation;
          }
        })
      );

      setConsultations(consultationsWithDetails);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  const bookConsultation = async (
    astrologerId: string,
    consultationType: 'chat' | 'call' | 'video',
    durationMinutes: number = 30
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get astrologer rate
      const { data: astrologer } = await supabase
        .from('astrologers')
        .select('rate_per_minute')
        .eq('id', astrologerId)
        .single();

      if (!astrologer) throw new Error("Astrologer not found");

      const totalCost = astrologer.rate_per_minute * durationMinutes;

      // Create consultation
      const { data: consultation, error } = await supabase
        .from('astrology_consultations')
        .insert({
          user_id: user.id,
          astrologer_id: astrologerId,
          consultation_type: consultationType,
          duration_minutes: durationMinutes,
          total_cost: totalCost,
        })
        .select()
        .single();

      if (error) throw error;

      // Process payment
      const { data: { session } } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke('create-payment', {
        body: { consultationId: consultation.id },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) throw response.error;

      if (response.data?.url) {
        window.location.href = response.data.url;
      }

      toast({
        title: "Consultation Booked",
        description: "Your consultation has been booked successfully",
      });

      return consultation;
    } catch (error) {
      console.error("Error booking consultation:", error);
      toast({
        title: "Error",
        description: "Failed to book consultation",
        variant: "destructive",
      });
    }
  };

  const sendChatMessage = async (consultationId: string, message: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const response = await supabase.functions.invoke('astrology-chat', {
        body: { consultationId, message },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const fetchChatMessages = async (consultationId: string) => {
    try {
      const { data, error } = await supabase
        .from('astrology_chats')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChatMessages(data || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchAstrologers();
    fetchConsultations();
  }, []);

  return {
    astrologers,
    consultations,
    chatMessages,
    loading,
    bookConsultation,
    sendChatMessage,
    fetchChatMessages,
    refetchAstrologers: fetchAstrologers,
    refetchConsultations: fetchConsultations,
  };
};
