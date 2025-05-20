
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language/LanguageContext";

export const useSessionRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, registerForActivity } = useAuth();
  const { t } = useLanguage();
  
  const handleSessionRegister = async (session: any) => {
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
  
  return { handleSessionRegister };
};
