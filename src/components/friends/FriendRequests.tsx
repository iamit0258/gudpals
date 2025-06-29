
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/language/LanguageContext";
import { useFriendsService } from "@/hooks/useFriendsService";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FriendRequests = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { friendRequests, loading, respondToFriendRequest } = useFriendsService();

  const handleAccept = async (requestId: string) => {
    await respondToFriendRequest(requestId, 'accept');
  };

  const handleReject = async (requestId: string) => {
    await respondToFriendRequest(requestId, 'reject');
  };

  const handleMessage = (name: string) => {
    toast({
      title: t("opening_chat"),
      description: `${t("chat_with")} ${name}`,
    });
  };

  const handleCall = (name: string) => {
    toast({
      title: t("calling"),
      description: `${t("calling")} ${name}...`,
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return <div className="p-4 text-center">{t("loading")}...</div>;
  }

  if (friendRequests.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>{t("no_friend_requests")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {friendRequests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {getInitials(request.profiles?.display_name || "Unknown")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{request.profiles?.display_name || "Unknown User"}</h3>
                <p className="text-xs text-muted-foreground">{getTimeAgo(request.created_at)}</p>
                {request.message && (
                  <p className="text-sm text-muted-foreground mt-1">"{request.message}"</p>
                )}
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
                  onClick={() => handleMessage(request.profiles?.display_name || "Unknown")}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:bg-primary/10"
                  onClick={() => handleCall(request.profiles?.display_name || "Unknown")}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FriendRequests;
