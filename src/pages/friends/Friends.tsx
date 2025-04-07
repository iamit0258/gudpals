
import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NearbyFriends from "@/components/friends/NearbyFriends";
import Connections from "@/components/friends/Connections";
import FriendRequests from "@/components/friends/FriendRequests";
import { useLanguage } from "@/context/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const { t } = useLanguage();
  const [beaconActive, setBeaconActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showBeaconPage, setShowBeaconPage] = useState(false);

  const handleBeaconToggle = (checked) => {
    setBeaconActive(checked);
    
    if (checked) {
      toast({
        title: t("beacon_activated"),
        description: t("beacon_active_desc"),
      });
    } else {
      toast({
        title: t("beacon_deactivated"),
        description: t("beacon_inactive_desc"),
      });
    }
  };

  const handleAddFriend = () => {
    toast({
      title: t("friend_request_sent"),
      description: t("friend_request_desc"),
    });
  };

  if (showBeaconPage) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-700 text-white">
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4 text-white"
              onClick={() => setShowBeaconPage(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
            
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <h1 className="text-2xl font-bold mb-8">Light Your Beacon</h1>
              
              <Button 
                variant={beaconActive ? "default" : "outline"}
                className={`rounded-full py-3 px-6 ${
                  beaconActive 
                    ? "bg-white text-blue-900" 
                    : "bg-gray-600/50 text-white border-0"
                }`}
                onClick={() => handleBeaconToggle(!beaconActive)}
              >
                <span className="text-lg font-medium">
                  Beacon is {beaconActive ? "ON" : "OFF"}
                </span>
              </Button>
              
              <p className="mt-6 text-center px-8">
                Beacon is {beaconActive ? "on" : "off"}. 
                {beaconActive 
                  ? " Your location is now visible to nearby friends." 
                  : " Turn it on to find travelers and accommodations around you."}
              </p>
              
              <div className="mt-14 w-full max-w-xs">
                <div className="relative w-full aspect-square">
                  {/* Beacon circles - largest outer circle */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300/50"></div>
                  
                  {/* Middle circles with declining opacity */}
                  <div className="absolute inset-[12%] rounded-full bg-blue-500/20"></div>
                  <div className="absolute inset-[24%] rounded-full bg-blue-500/30"></div>
                  <div className="absolute inset-[36%] rounded-full bg-blue-500/40"></div>
                  <div className="absolute inset-[48%] rounded-full bg-blue-400/60"></div>
                  
                  {/* Center dark circle */}
                  <div className="absolute inset-[60%] rounded-full bg-black"></div>
                </div>
              </div>
              
              {/* Bottom indicator bar */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <div className="w-1/3 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="py-6">
        <div className="px-4 flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("friends")}</h1>
          <Button 
            onClick={handleAddFriend}
            size="sm" 
            className="bg-primary hover:bg-dhayan-teal-dark text-white rounded-full"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            {t("add_friend")}
          </Button>
        </div>
        
        <Tabs defaultValue="nearby" className="w-full">
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="nearby">{t("nearby")}</TabsTrigger>
              <TabsTrigger value="connections">{t("connections")}</TabsTrigger>
              <TabsTrigger value="requests">{t("requests")}</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="nearby">
            <div className="px-4 mb-4 flex items-center justify-between bg-dhayan-teal/5 p-3 rounded-lg">
              <div>
                <h3 className="font-medium text-sm">{t("location_beacon")}</h3>
                <p className="text-xs text-muted-foreground">{beaconActive ? t("beacon_visible") : t("beacon_invisible")}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBeaconPage(true)}
              >
                {t("manage")}
              </Button>
            </div>
            <NearbyFriends isActive={beaconActive} />
          </TabsContent>
          
          <TabsContent value="connections">
            <Connections />
          </TabsContent>
          
          <TabsContent value="requests">
            <FriendRequests />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Friends;
