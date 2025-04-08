
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import SessionsList from "@/components/sessions/SessionsList";
import { useSessionsService } from "@/hooks/useSessionsService";
import { useSessionRegistration } from "@/hooks/useSessionRegistration";

const Sessions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { sessions, loading } = useSessionsService();
  const { handleSessionRegister } = useSessionRegistration();
  
  useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: t("registration_successful"),
        description: `${t("registered_for")} ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate, t]);

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-green-DEFAULT">{t("your_sessions")}</h1>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">{t("upcoming_sessions")}</h2>
          <SessionsList 
            sessions={sessions} 
            loading={loading} 
            onRegister={handleSessionRegister} 
          />
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
