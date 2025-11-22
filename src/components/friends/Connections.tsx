import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Phone, Video, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { useNavigate } from "react-router-dom";

const mockConnections = [
  {
    id: "1",
    name: {
      en: "Sunil Patil",
      hi: "सुनील पाटिल"
    },
    status: "online",
    lastSeen: "Active now"
  },
];

const Connections = () => {
  const [connections] = useState(mockConnections);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleMessage = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  const handleVoiceCall = (name: any) => {
    const displayName = typeof name === 'object' ? (language === 'en' ? name.en : name.hi) : name;
    toast({
      title: t("calling"),
      description: `${t("voice_calling")} ${displayName}...`,
    });
  };

  const handleVideoCall = (name: any) => {
    const displayName = typeof name === 'object' ? (language === 'en' ? name.en : name.hi) : name;
    toast({
      title: t("video_calling"),
      description: `${t("video_calling")} ${displayName}...`,
    });
  };

  const filteredConnections = connections.filter(connection => {
    const nameToCheck = typeof connection.name === 'object'
      ? (language === 'en' ? connection.name.en : connection.name.hi)
      : connection.name;

    return nameToCheck.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDisplayName = (nameObj: any) => {
    if (typeof nameObj === 'object') {
      return language === 'en' ? nameObj.en : nameObj.hi;
    }
    return nameObj || '';
  };

  const getInitial = (nameObj: any) => {
    const displayName = getDisplayName(nameObj);
    return displayName ? displayName.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder={t("search_friends")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredConnections.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>{t("no_matches_found")}</p>
        </div>
      ) : (
        filteredConnections.map((connection) => (
          <Card key={connection.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarFallback className="text-white bg-gradient-to-br from-green-500 to-blue-500">
                      {getInitial(connection.name)}
                    </AvatarFallback>
                  </Avatar>
                  {connection.status === "online" && (
                    <span className="absolute bottom-0 right-4 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {getDisplayName(connection.name)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {connection.status === "online" ? t("active_now") : connection.lastSeen}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-dhayan-teal hover:bg-dhayan-teal/10 rounded-full h-9 w-9 p-0"
                    onClick={() => handleMessage(connection.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-dhayan-purple hover:bg-dhayan-purple/10 rounded-full h-9 w-9 p-0"
                    onClick={() => handleVoiceCall(connection.name)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-dhayan-orange hover:bg-dhayan-orange/10 rounded-full h-9 w-9 p-0"
                    onClick={() => handleVideoCall(connection.name)}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Connections;
