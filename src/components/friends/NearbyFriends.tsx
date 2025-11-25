
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radio, MapPin, MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";

const NearbyFriends = () => {
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [friends, setFriends] = useState([]);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const toggleBeacon = () => {
    setIsBeaconActive(!isBeaconActive);
    if (!isBeaconActive) {
      toast({
        title: t("beacon_activated"),
        description: t("beacon_activated_desc"),
      });
    } else {
      toast({
        title: t("beacon_deactivated"),
        description: t("beacon_deactivated_desc"),
      });
    }
  };

  const handleMessage = (name) => {
    toast({
      title: t("opening_chat"),
      description: `${t("chat_with")} ${name}`,
    });
  };

  const handleCall = (name) => {
    toast({
      title: t("calling"),
      description: `${t("calling")} ${name}...`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col items-center bg-gradient-to-b from-green-900 to-green-600">
        <h2 className="text-2xl font-bold text-white mb-4">{t("beacon")}</h2>

        <Button
          onClick={toggleBeacon}
          className={`rounded-full mb-4 px-8 py-2 ${isBeaconActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-500/60 hover:bg-gray-500/80"
            } transition-all`}
        >
          <Radio className="h-5 w-5 mr-2" />
          {isBeaconActive ? t("beacon_on") : t("beacon_off")}
        </Button>

        <p className="text-center text-white/80 mb-8">
          {isBeaconActive
            ? t("beacon_active_desc")
            : t("beacon_inactive_desc")}
        </p>

        {/* Concentric circles visualization */}
        <div className="relative w-64 h-64 mb-6">
          {/* Outer circle (dashed) */}
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-dashed border-green-300/50 animate-pulse"></div>

          {/* Animated pulse rings */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 h-5/6 rounded-full bg-green-400/20 ${isBeaconActive ? 'animate-ping opacity-70' : 'opacity-30'}`} style={{ animationDuration: '3s' }}></div>

          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-green-400/30 ${isBeaconActive ? 'animate-ping opacity-80' : 'opacity-40'}`} style={{ animationDuration: '2.5s' }}></div>

          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-green-400/40 ${isBeaconActive ? 'animate-ping opacity-90' : 'opacity-50'}`} style={{ animationDuration: '2s' }}></div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-50 shadow-lg flex items-center justify-center z-10">
            <div className={`w-6 h-6 rounded-full ${isBeaconActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
        </div>
      </div>

      {/* Nearby friends section */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold mb-2">{t("Nearby Friends")}</h3>

        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="text-white bg-gradient-to-br from-purple-500 to-pink-500">
                        {friend.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{friend.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{friend.distance}</span>
                        <span className="mx-2">•</span>
                        <span>{friend.lastSeen}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleMessage(friend.name)}
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleCall(friend.name)}
                      >
                        <Phone className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>{t("No Nearby Friends")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFriends;
