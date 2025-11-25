import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/context/language/LanguageContext";
import { useAuth } from "@/context/ClerkAuthBridge";

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    instructor: string | null;
    time: string;
    date: string;
    category: string;
    image: string | null;
    is_live?: boolean;
  };
  onRegister: (session: any) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onRegister }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
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
            {session.is_live && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse font-bold">
                LIVE
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base">{session.title}</h3>
          <p className="text-sm text-dhayan-gray">{session.instructor}</p>
          <div className="flex items-center mt-2 text-sm text-dhayan-gray-dark">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{session.date}</span>
            <Clock className="h-4 w-4 ml-3 mr-1" />
            <span>{session.time}</span>
          </div>

          {session.is_live ? (
            <Button
              className="w-full mt-3 bg-red-600 text-white hover:bg-red-700"
              onClick={() => navigate(`/sessions/${session.id}/live`)}
            >
              Join Live Session
            </Button>
          ) : (
            <>
              <Button
                className="w-full mt-3 bg-dhayan-green-DEFAULT text-white hover:bg-opacity-90"
                onClick={() => onRegister(session)}
              >
                {t("register")}
              </Button>
              {/* Only allow specific admin to host */}
              {user?.email === "mevarun.arcade@gmail.com" && (
                <Button
                  variant="outline"
                  className="w-full mt-2 text-xs h-8 border-dashed"
                  onClick={() => navigate(`/sessions/${session.id}/live`)}
                >
                  Host Session (Admin)
                </Button>
              )}
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default SessionCard;
