
import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/language/LanguageContext";
import { useAuth } from "@/context/auth";

const FeaturedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { registerForActivity } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Force using mock data for dynamic dates
        setSessions([]); // This will trigger the fallback logic below which uses mock data

        /* 
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('activity_type', 'session')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setSessions(data || []);
        */
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [t, language]); // Added dependencies for dynamic dates

  const getCategoryColor = (category) => {
    switch (category) {
      case "Yoga":
      case "योग":
        return "bg-dhayan-green text-green-800";
      case "Digital Literacy":
      case "डिजिटल साक्षरता":
        return "bg-dhayan-orange text-orange-800";
      case "Entertainment":
      case "मनोरंजन":
        return "bg-dhayan-purple-light text-dhayan-purple-dark";
      case "Safety":
      case "सुरक्षा":
        return "bg-dhayan-pink text-rose-800";
      case "Cooking":
      case "पाकशाला":
        return "bg-amber-200 text-amber-800";
      case "Arts":
      case "कला":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-dhayan-yellow text-amber-800";
    }
  };

  const handleRegister = (session) => {
    registerForActivity("session", session.title, "/sessions");
  };

  if (loading) {
    return (
      <div className="flex space-x-4 pb-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-64 flex-shrink-0 overflow-hidden animate-pulse">
            <div className="h-32 bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/5"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Fallback sessions if no data from database
  const featuredSessions = sessions.length > 0 ? sessions : [
    {
      id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      title: language === "en" ? "Morning Yoga" : "प्रातःकालीन योग",
      instructor: language === "en" ? "Anjali Sharma" : "अंजलि शर्मा",
      start_time: new Date().setHours(8, 0, 0, 0),
      category: language === "en" ? "Yoga" : "योग",
      participants: 24,
      image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
      title: language === "en" ? "Online Safety Workshop" : "ऑनलाइन सुरक्षा कार्यशाला",
      instructor: language === "en" ? "Sanjay Gupta" : "संजय गुप्ता",
      start_time: new Date().setHours(14, 0, 0, 0),
      category: language === "en" ? "Safety" : "सुरक्षा",
      participants: 18,
      image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop"
    }
  ];

  return (
    <ScrollArea className="-mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {featuredSessions.map((session) => {
          // Format the time
          const time = session.start_time ? new Date(session.start_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }) : "8:00 AM";

          // Determine if date is today or tomorrow
          let dateText = "Today";
          if (session.start_time) {
            const sessionDate = new Date(session.start_time);
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (sessionDate.toDateString() === today.toDateString()) {
              dateText = t("today");
            } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
              dateText = t("tomorrow");
            } else {
              dateText = sessionDate.toLocaleDateString();
            }
          }

          return (
            <Card
              key={session.id}
              className="w-64 md:w-full flex-shrink-0 md:flex-shrink overflow-hidden cursor-pointer transition-transform hover:scale-105"
            >
              <div className="relative h-32">
                <img
                  src={session.image_url || "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?q=80&w=300&auto=format&fit=crop"}
                  alt={session.title}
                  className="object-cover w-full h-full"
                />
                <Badge
                  className={`absolute top-2 left-2 ${getCategoryColor(session.category)}`}
                  variant="outline"
                >
                  {session.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{session.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t("by")} {session.instructor}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="mr-3">{time}</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{dateText}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1 mb-3">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{session.participants || 15} {t("participants")}</span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-dhayan-teal-dark text-white"
                  onClick={() => handleRegister(session)}
                >
                  {t("register")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default FeaturedSessions;
