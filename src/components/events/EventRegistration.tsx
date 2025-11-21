
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, MapPin, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { useAuth } from "@/context/auth";
import { useEventRegistration } from "@/hooks/useEventRegistration";

interface EventRegistrationProps {
  eventId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants?: number;
  isRegistered?: boolean;
  onRegister?: () => void;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  eventId,
  title,
  date,
  time,
  location,
  participants,
  maxParticipants = 30,
  isRegistered: initialIsRegistered = false,
  onRegister
}) => {
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { registerForEvent, unregisterFromEvent, isRegisteredForEvent, loading } = useEventRegistration();

  // Check registration status on component mount
  useEffect(() => {
    const checkRegistration = async () => {
      if (user) {
        const registered = await isRegisteredForEvent(eventId);
        setIsRegistered(registered);
      }
      setCheckingRegistration(false);
    };

    checkRegistration();
  }, [eventId, user, isRegisteredForEvent]);
  
  const handleRegister = async () => {
    if (!user) {
      // Store event info in sessionStorage for after login
      sessionStorage.setItem("event_registration", JSON.stringify({ 
        eventId, 
        title,
        redirectPath: window.location.pathname
      }));
      
      // Redirect to register/login
      navigate("/register", { 
        state: { 
          from: window.location.pathname,
          activityType: "event",
          activityName: title
        } 
      });
      return;
    }
    
    if (isRegistered) {
      // Unregister from event
      const success = await unregisterFromEvent(eventId, title);
      if (success) {
        setIsRegistered(false);
        if (onRegister) {
          onRegister();
        }
      }
    } else {
      // Register for event
      const success = await registerForEvent(eventId, title);
      if (success) {
        setIsRegistered(true);
        if (onRegister) {
          onRegister();
        }
      }
    }
  };
  const getButtonText = () => {
    if (loading) return t("processing");
    if (isRegistered) return t("unregister");
    if (participants >= maxParticipants) return t("event_full");
    return t("register");
  };

  const getButtonVariant = () => {
    if (isRegistered) return "destructive";
    if (participants >= maxParticipants) return "secondary";
    return "default";
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          {title}
          {isRegistered && (
            <Bell className="h-5 w-5 text-green-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{time}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {participants} / {maxParticipants} {t("participants")}
            {participants >= maxParticipants && (
              <span className="ml-2 text-red-600 font-medium">({t("full")})</span>
            )}
          </span>
        </div>

        {isRegistered && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
            <div className="flex items-center text-green-800 text-sm">
              <Bell className="h-4 w-4 mr-2" />
              <span>You'll receive reminders 24h, 1h, and 15 minutes before the event</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRegister} 
          disabled={loading || checkingRegistration || (participants >= maxParticipants && !isRegistered)}
          className="w-full"
          variant={getButtonVariant()}
        >
          {checkingRegistration ? "Checking..." : getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventRegistration;
