
import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NearbyFriends from "@/components/friends/NearbyFriends";
import Connections from "@/components/friends/Connections";
import FriendRequests from "@/components/friends/FriendRequests";
import { useLanguage } from "@/context/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Friends = () => {
  const { t } = useLanguage();
  const [beaconActive, setBeaconActive] = useState(false);
  const { toast } = useToast();

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
              <Switch 
                checked={beaconActive}
                onCheckedChange={handleBeaconToggle}
              />
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
