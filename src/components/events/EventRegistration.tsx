
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { useAuth } from "@/context/auth";

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
  isRegistered = false,
  onRegister
}) => {
  const [registering, setRegistering] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
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
    
    setRegistering(true);
    
    try {
      // Mock API call - in a real app, this would call the actual registration API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t("registration_successful"),
        description: `${t("registered_for")} ${title}`,
      });
      
      if (onRegister) {
        onRegister();
      }
    } catch (error) {
      toast({
        title: t("registration_failed"),
        description: t("registration_error"),
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
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
          <span>{participants} / {maxParticipants} {t("participants")}</span>
        </div>
      </CardContent>
      <CardFooter>
        {isRegistered ? (
          <Button disabled className="w-full bg-green-500 hover:bg-green-600">
            ✓ {t("already_registered")}
          </Button>
        ) : (
          <Button 
            onClick={handleRegister} 
            disabled={registering}
            className="w-full"
          >
            {registering ? t("processing") : t("register")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventRegistration;
