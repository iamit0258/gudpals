
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/language/LanguageContext";

interface Session {
  id: string;
  title: string;
  instructor: string | null;
  time: string;
  date: string;
  category: string;
  image: string | null;
  is_live?: boolean;
}

export const useSessionsService = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  const mockSessions = [
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      title: language === "en" ? "Morning Yoga" : "प्रातःकालीन योग",
      instructor: language === "en" ? "Anjali Sharma" : "अंजलि शर्मा",
      time: "8:00 AM - 9:00 AM",
      date: t("today"),
      category: language === "en" ? "Wellness" : "स्वास्थ्य",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
      title: language === "en" ? "Online Safety Workshop" : "ऑनलाइन सुरक्षा कार्यशाला",
      instructor: language === "en" ? "Sanjay Gupta" : "संजय गुप्ता",
      time: "2:00 PM - 3:30 PM",
      date: t("tomorrow"),
      category: language === "en" ? "Safety" : "सुरक्षा",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15",
      title: language === "en" ? "Cooking Class: Healthy Recipes" : "पाक कला: स्वस्थ व्यंजन",
      instructor: language === "en" ? "Priya Malhotra" : "प्रिया मल्होत्रा",
      time: "10:00 AM - 11:30 AM",
      date: t("tomorrow"),
      category: language === "en" ? "Cooking" : "पाकशाला",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16",
      title: language === "en" ? "Music Appreciation" : "संगीत रसास्वादन",
      instructor: language === "en" ? "Hari Menon" : "हरि मेनन",
      time: "3:00 PM - 4:00 PM",
      date: language === "en" ? "Next Week" : "अगले सप्ताह",
      category: language === "en" ? "Arts" : "कला",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Force using mock sessions for dynamic "Today/Tomorrow" dates
        setSessions(mockSessions);

        /* 
        // Commenting out database fetch to ensure dynamic dates from mockSessions
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('activity_type', 'session');
  
        if (error || !data || data.length === 0) {
          setSessions(mockSessions);
        } else {
          const formattedSessions = data.map(session => {
            const startTime = session.start_time ? new Date(session.start_time) : null;
            const endTime = session.end_time ? new Date(session.end_time) : null;
  
            const timeStr = startTime && endTime
              ? `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : "Flexible timing";
  
            const dateStr = startTime
              ? startTime.toDateString() === new Date().toDateString()
                ? t("today")
                : startTime.toDateString() === new Date(Date.now() + 86400000).toDateString()
                  ? t("tomorrow")
                  : startTime.toLocaleDateString()
              : "Anytime";
  
            return {
              id: session.id,
              title: session.title,
              instructor: session.instructor,
              time: timeStr,
              date: dateStr,
              category: session.category,
              image: session.image_url,
              is_live: (session as any).is_live // Cast to any until types are updated
            };
          });
  
          setSessions(formattedSessions);
        }
        */
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setSessions(mockSessions);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [t, language]);

  return { sessions, loading };
};
