
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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Handle registration success notification
  useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Registration Successful",
        description: `You've been registered for ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  // Fetch sessions from Supabase
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('activity_type', 'session');
        
        if (error) throw error;
        
        // Transform data into the format we need
        const formattedSessions = data.map(session => {
          // Format date and time
          const startTime = session.start_time ? new Date(session.start_time) : null;
          const endTime = session.end_time ? new Date(session.end_time) : null;
          
          // Create a readable time range if both times exist
          const timeStr = startTime && endTime 
            ? `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : "Flexible timing";
          
          // Format the date
          const dateStr = startTime 
            ? startTime.toDateString() === new Date().toDateString() 
              ? "Today" 
              : startTime.toDateString() === new Date(Date.now() + 86400000).toDateString()
                ? "Tomorrow"
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
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast({
          title: "Error",
          description: "Failed to load sessions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [toast]);

  const handleSessionRegister = async (session: Session) => {
    if (user) {
      try {
        // Check if already registered
        const { data: existingReg, error: checkError } = await supabase
          .from('registrations')
          .select('*')
          .eq('user_id', user.uid)
          .eq('activity_id', session.id);
        
        if (checkError) throw checkError;
        
        if (existingReg && existingReg.length > 0) {
          toast({
            title: "Already Registered",
            description: `You're already registered for ${session.title}`,
          });
          return;
        }
        
        // Register for the session
        const { error: regError } = await supabase
          .from('registrations')
          .insert({
            user_id: user.uid,
            activity_id: session.id
          });
          
        if (regError) throw regError;
        
        toast({
          title: "Registration Successful",
          description: `You've been registered for ${session.title}`,
        });
      } catch (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Use the existing registerForActivity function for unauthenticated users
      registerForActivity("session", session.title, "/sessions");
    }
  };

  // Render loading skeletons
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
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Your Sessions</h1>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Upcoming Sessions</h2>
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
                        className="h-full object-cover"
                      />
                    </div>
                    <CardContent className="w-2/3 p-3">
                      <div className="mb-1">
                        <span className="text-xs bg-dhayan-purple-light text-dhayan-purple-dark px-2 py-0.5 rounded-full">
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
                        className="w-full mt-3 bg-dhayan-purple text-white hover:bg-dhayan-purple-dark"
                        onClick={() => handleSessionRegister(session)}
                      >
                        Register
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <p className="text-dhayan-gray-dark">No upcoming sessions found.</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Recommended For You</h2>
          <div className="p-6 text-center bg-gray-50 rounded-lg">
            <p className="text-dhayan-gray-dark">More sessions coming soon!</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Sessions;
