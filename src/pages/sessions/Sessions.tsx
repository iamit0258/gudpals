import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language/LanguageContext";

interface Session {
  id: string;
  title: string;
  instructor: string | null;
  time: string;
  date: string;
  category: string;
  image: string | null;
}

const Sessions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, registerForActivity } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  
  useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: t("registration_successful"),
        description: `${t("registered_for")} ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate, t]);
  
  const mockSessions = [
    {
      id: "1",
      title: language === "en" ? "Morning Yoga" : "प्रातःकालीन योग",
      instructor: language === "en" ? "Anjali Sharma" : "अंजलि शर्मा",
      time: "8:00 AM - 9:00 AM",
      date: t("today"),
      category: language === "en" ? "Wellness" : "स्वास्थ्य",
      image: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "2",
      title: language === "en" ? "Smartphone Basics" : "स्मार्टफोन मूल बातें",
      instructor: language === "en" ? "Raj Kumar" : "राज कुमार",
      time: "11:00 AM - 12:30 PM",
      date: t("today"),
      category: language === "en" ? "Digital Literacy" : "डिजिटल साक्षरता",
      image: "https://images.unsplash.com/photo-1601784551062-20c13f969c4c?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "3",
      title: language === "en" ? "Tambola Evening" : "तम्बोला शाम",
      instructor: language === "en" ? "Meera Patel" : "मीरा पटेल",
      time: "4:00 PM - 6:00 PM",
      date: t("today"),
      category: language === "en" ? "Entertainment" : "मनोरंजन",
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "4",
      title: language === "en" ? "Online Safety Workshop" : "ऑनलाइन सुरक्षा कार्यशाला",
      instructor: language === "en" ? "Sanjay Gupta" : "संजय गुप्ता",
      time: "2:00 PM - 3:30 PM",
      date: t("tomorrow"),
      category: language === "en" ? "Safety" : "सुरक्षा",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "5",
      title: language === "en" ? "Cooking Class: Healthy Recipes" : "पाक कला: स्वस्थ व्यंजन",
      instructor: language === "en" ? "Priya Malhotra" : "प्रिया मल्होत्रा",
      time: "10:00 AM - 11:30 AM",
      date: t("tomorrow"),
      category: language === "en" ? "Cooking" : "पाकशाला",
      image: "https://images.unsplash.com/photo-1556911220-bda9f7b8e9cb?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "6",
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
              image: session.image_url
            };
          });
          
          setSessions(formattedSessions);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setSessions(mockSessions);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [t, language]);

  const handleSessionRegister = async (session) => {
    if (!user) {
      navigate("/register", {
        state: {
          activityType: "session",
          activityName: session.title,
          activityId: session.id,
          from: "/sessions"
        }
      });
      return;
    }
    
    try {
      const { data: existingReg, error: checkError } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.uid)
        .eq('activity_id', session.id);
      
      if (checkError) throw checkError;
      
      if (existingReg && existingReg.length > 0) {
        toast({
          title: t("already_registered"),
          description: `${t("already_registered_for")} ${session.title}`,
        });
        return;
      }
      
      await registerForActivity(
        "session",
        session.title,
        "/sessions"
      );
      
      toast({
        title: t("registration_successful"),
        description: `${t("registered_for")} ${session.title}`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: t("registration_failed"),
        description: t("registration_error"),
        variant: "destructive",
      });
    }
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex">
            <div className="w-1/3">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="w-2/3 p-3">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-green-DEFAULT">{t("your_sessions")}</h1>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">{t("upcoming_sessions")}</h2>
          {loading ? (
            renderSkeletons()
          ) : sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3">
                      <img 
                        src={session.image || "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?q=80&w=300&auto=format&fit=crop"} 
                        alt={session.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="w-2/3 p-3">
                      <div className="mb-1">
                        <span className="text-xs bg-dhayan-green-light text-dhayan-green-DEFAULT px-2 py-0.5 rounded-full">
                          {session.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base">{session.title}</h3>
                      <p className="text-sm text-dhayan-gray">{session.instructor}</p>
                      <div className="flex items-center mt-2 text-sm text-dhayan-gray-dark">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{session.date}</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{session.time}</span>
                      </div>
                      <Button 
                        className="w-full mt-3 bg-dhayan-green-DEFAULT text-white hover:bg-opacity-90"
                        onClick={() => handleSessionRegister(session)}
                      >
                        {t("register")}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <p className="text-dhayan-gray-dark">{t("no_upcoming_sessions")}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">{t("recommended_for_you")}</h2>
          <div className="p-6 text-center bg-gray-50 rounded-lg">
            <p className="text-dhayan-gray-dark">{t("more_sessions_coming")}</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Sessions;
