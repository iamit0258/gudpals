
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Phone, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { useFriendsService } from "@/hooks/useFriendsService";

const Connections = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { connections, loading } = useFriendsService();

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

  const handleRemove = (name: string) => {
    toast({
      title: t("connection_removed"),
      description: `${name} has been removed from your connections`,
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

  if (connections.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No connections yet. Start connecting with people!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {connections.map((connection) => (
        <Card key={connection.id}>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {getInitials(connection.profiles?.display_name || "Unknown")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{connection.profiles?.display_name || "Unknown User"}</h3>
                <p className="text-xs text-muted-foreground">
                  Connected {getTimeAgo(connection.connected_at)}
                </p>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary hover:bg-primary/10"
                  onClick={() => handleMessage(connection.profiles?.display_name || "Unknown")}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary hover:bg-primary/10"
                  onClick={() => handleCall(connection.profiles?.display_name || "Unknown")}
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleRemove(connection.profiles?.display_name || "Unknown")}
                >
                  <UserMinus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Connections;
