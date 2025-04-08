
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radio, MapPin, MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";

// Mock data for nearby friends
const mockNearbyFriends = [
  {
    id: "1",
    name: "राम कुमार",
    avatar: "https://i.pravatar.cc/150?img=1",
    distance: "0.5 km",
    lastSeen: "2 mins ago"
  },
  {
    id: "2",
    name: "सुनीता शर्मा",
    avatar: "https://i.pravatar.cc/150?img=2",
    distance: "1.2 km",
    lastSeen: "5 mins ago"
  },
  {
    id: "3",
    name: "अनिल पटेल",
    avatar: "https://i.pravatar.cc/150?img=3",
    distance: "2.4 km",
    lastSeen: "15 mins ago"
  }
];

const NearbyFriends = () => {
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [friends, setFriends] = useState(mockNearbyFriends);
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
      <div className="p-6 flex-1 flex flex-col items-center bg-gradient-to-b from-blue-900 to-blue-600">
        <h2 className="text-2xl font-bold text-white mb-4">Light Your Beacon</h2>
        
        <Button 
          onClick={toggleBeacon}
          className={`rounded-full mb-4 px-8 py-2 ${
            isBeaconActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-500/60 hover:bg-gray-500/80"
          } transition-all`}
        >
          <Radio className="h-5 w-5 mr-2" />
          {isBeaconActive ? "Beacon is ON" : "Beacon is OFF"}
        </Button>
        
        <p className="text-center text-white/80 mb-8">
          {isBeaconActive 
            ? "Your beacon is active. Nearby travelers can see you."
            : "Beacon is off. Turn it on to find travelers and accommodations around you."}
        </p>
        
        {/* Concentric circles visualization */}
        <div className="relative w-64 h-64">
          {/* Outer circle (dashed) */}
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-dashed border-blue-300/50"></div>
          
          {/* Circle 1 (outermost solid) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 h-5/6 rounded-full bg-blue-400/20"></div>
          
          {/* Circle 2 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-blue-400/30"></div>
          
          {/* Circle 3 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-blue-400/40"></div>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/6 h-1/6 rounded-full bg-black"></div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold mb-2">{t("nearby_friends")}</h3>
        
        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
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
            <p>{t("no_nearby_friends")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFriends;
