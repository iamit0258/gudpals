
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
import { useSessionRegistration } from "@/hooks/useSessionRegistration";

const FeaturedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { handleSessionRegister } = useSessionRegistration();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('activity_type', 'session')
          .eq('is_active', true)
          .order('start_time', { ascending: true })
          .limit(4);

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase();
    if (cat?.includes("yoga") || cat?.includes("wellness")) return "bg-dhayan-green text-green-800";
    if (cat?.includes("literacy") || cat?.includes("tech")) return "bg-dhayan-orange text-orange-800";
    if (cat?.includes("entertainment") || cat?.includes("fun")) return "bg-dhayan-purple-light text-dhayan-purple-dark";
    if (cat?.includes("safety")) return "bg-dhayan-pink text-rose-800";
    return "bg-dhayan-yellow text-amber-800";
  };

  if (loading) {
    return (
      <div className="flex space-x-4 pb-4 overflow-x-auto">
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

  return (
    <ScrollArea className="-mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
<<<<<<< HEAD
  {
    featuredSessions.map((session) => {
      // Format the time
=======
        {sessions.map((session: any) => {
          const title = language === "hi" && session.title_hi ? session.title_hi : session.title;
          const instructor = language === "hi" && session.instructor_hi ? session.instructor_hi : session.instructor;
          const category = language === "hi" && session.category_hi ? session.category_hi : session.category;

>>>>>>> my-branch
      const time = session.start_time ? new Date(session.start_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }) : "8:00 AM";

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
              alt={title}
              className="object-cover w-full h-full"
            />
            <Badge
              className={`absolute top-2 left-2 ${getCategoryColor(category)}`}
              variant="outline"
            >
              {category}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t("by")} {instructor}
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
              onClick={() => handleSessionRegister(session)}
            >
              {t("register")}
            </Button>
          </CardContent>
        </Card>
      );
    })
  }
      </div >
  <ScrollBar orientation="horizontal" />
    </ScrollArea >
  );
};

export default FeaturedSessions;
