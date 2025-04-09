
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import { useLanguage } from "@/context/language/LanguageContext";

export const useSessionRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { t } = useLanguage();
  
  const handleSessionRegister = async (session: any) => {
    if (!isSignedIn) {
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
      // Using user.id from Clerk
      const userId = user?.id;
      
      const { data: existingReg, error: checkError } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_id', session.id);
      
      if (checkError) throw checkError;
      
      if (existingReg && existingReg.length > 0) {
        toast({
          title: t("already_registered"),
          description: `${t("already_registered_for")} ${session.title}`,
        });
        return;
      }
      
      // Register for session
      const { error } = await supabase
        .from('registrations')
        .insert({
          user_id: userId,
          activity_id: session.id,
          activity_type: 'session',
          activity_name: session.title,
          registered_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
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
  
  return { handleSessionRegister };
};
