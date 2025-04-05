
import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NearbyFriends from "@/components/friends/NearbyFriends";
import { useLanguage } from "@/context/language/LanguageContext";

// Placeholder components for other tabs
const Connections = () => {
  return <div className="p-4 text-center text-muted-foreground">Your connections will appear here</div>;
};

const Requests = () => {
  return <div className="p-4 text-center text-muted-foreground">Friend requests will appear here</div>;
};

const Friends = () => {
  const { t } = useLanguage();

  return (
    <MobileLayout>
      <div className="py-6">
        <h1 className="text-3xl font-bold text-center mb-6">{t("friends")}</h1>
        
        <Tabs defaultValue="nearby" className="w-full">
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="nearby">{t("nearby")}</TabsTrigger>
              <TabsTrigger value="connections">{t("connections")}</TabsTrigger>
              <TabsTrigger value="requests">{t("requests")}</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="nearby">
            <NearbyFriends />
          </TabsContent>
          
          <TabsContent value="connections">
            <Connections />
          </TabsContent>
          
          <TabsContent value="requests">
            <Requests />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Friends;
