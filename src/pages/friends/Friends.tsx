
import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Radio, Users, UserPlus } from "lucide-react";
import NearbyFriends from "@/components/friends/NearbyFriends";
import Connections from "@/components/friends/Connections";
import FriendRequests from "@/components/friends/FriendRequests";
import { useLanguage } from "@/context/language/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const Friends = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("connections");
  
  const handleAddFriend = () => {
    toast({
      title: language === "en" ? "Coming Soon" : "जल्द आ रहा है",
      description: language === "en" 
        ? "This feature will be available soon" 
        : "यह सुविधा जल्द ही उपलब्ध होगी",
    });
  };
  
  return (
    <MobileLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {language === "en" ? "Friends" : "मित्र"}
          </h1>
          <Button onClick={handleAddFriend}>
            <UserPlus className="h-4 w-4 mr-2" />
            {language === "en" ? "Add Friend" : "मित्र जोड़ें"}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="connections">
              <Users className="h-4 w-4 mr-2" />
              {language === "en" ? "Connections" : "कनेक्शन"}
            </TabsTrigger>
            <TabsTrigger value="nearby">
              <Radio className="h-4 w-4 mr-2" />
              {language === "en" ? "Nearby" : "आस-पास"}
            </TabsTrigger>
            <TabsTrigger value="requests">
              {language === "en" ? "Requests" : "अनुरोध"}
              {/* Add a badge here if needed for notification count */}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections">
            <Connections />
          </TabsContent>
          
          <TabsContent value="nearby">
            <NearbyFriends />
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
