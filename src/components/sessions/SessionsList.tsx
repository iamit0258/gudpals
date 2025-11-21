import React from "react";
import SessionCard from "./SessionCard";
import SessionSkeletons from "./SessionSkeletons";
import { useLanguage } from "@/context/language/LanguageContext";

interface SessionsListProps {
  sessions: any[];
  loading: boolean;
  onRegister: (session: any) => void;
}

const SessionsList: React.FC<SessionsListProps> = ({ sessions, loading, onRegister }) => {
  const { t } = useLanguage();
  
  if (loading) {
    return <SessionSkeletons />;
  }
  
  if (sessions.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg">
        <p className="text-dhayan-gray-dark">{t("no_upcoming_sessions")}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard 
          key={session.id} 
          session={session} 
          onRegister={onRegister}
        />
      ))}
    </div>
  );
};

export default SessionsList;
