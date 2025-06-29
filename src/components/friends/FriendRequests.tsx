
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language/LanguageContext";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // For now, we'll show no friend requests since mock data was removed
    setLoading(false);
  }, [user]);

  const handleAccept = (id) => {
    toast({
      title: t("request_accepted"),
      description: t("friend_added_success"),
    });
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleReject = (id) => {
    toast({
      title: t("request_declined"),
      description: t("friend_request_declined"),
    });
    setRequests(requests.filter(req => req.id !== id));
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

  if (loading) {
    return <div className="p-4 text-center">{t("loading")}...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>{t("no_friend_requests")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 to-purple-600">
                  {request.name ? request.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{request.name}</h3>
                <p className="text-xs text-muted-foreground">{request.time}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => handleAccept(request.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {t("accept")}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => handleReject(request.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t("decline")}
                </Button>
              </div>
              <div className="space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:bg-primary/10"
                  onClick={() => handleMessage(request.name)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:bg-primary/10"
                  onClick={() => handleCall(request.name)}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FriendRequests;
