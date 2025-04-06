
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Video, UserPlus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";

interface Friend {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  image: string;
  status: "active" | "away" | "offline";
  distance?: string;
  lastSeen?: string;
  isRequestSent?: boolean;
}

const mockFriends: Friend[] = [
  {
    id: "1",
    name: {
      en: "Sunil Patil",
      hi: "सुनील पाटिल"
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    status: "active",
    distance: "2.3 km"
  },
  {
    id: "2",
    name: {
      en: "Anuradha Gupta",
      hi: "अनुराधा गुप्ता"
    },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
    status: "active",
    distance: "3.7 km"
  },
  {
    id: "3",
    name: {
      en: "Vikas Sharma",
      hi: "विकास शर्मा"
    },
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
    status: "offline",
    lastSeen: "2h ago"
  },
  {
    id: "4",
    name: {
      en: "Priya Singh",
      hi: "प्रिया सिंह"
    },
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&q=80",
    status: "away",
    lastSeen: "30m ago"
  }
];

interface NearbyFriendsProps {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
}

const NearbyFriends: React.FC<NearbyFriendsProps> = ({ 
  isActive = false, 
  onToggle = () => {} 
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [friendList, setFriendList] = React.useState<Friend[]>(mockFriends);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const handleBeaconToggle = (checked: boolean) => {
    onToggle(checked);
    
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
  
  const handleAddFriend = (friendId: string) => {
    setFriendList(prev => prev.map(friend => 
      friend.id === friendId 
        ? { ...friend, isRequestSent: true }
        : friend
    ));
    
    toast({
      title: t("friend_request_sent"),
      description: t("friend_request_desc"),
    });
  };
  
  const handleChat = (friend: Friend) => {
    toast({
      title: t("opening_chat"),
      description: `${t("chat_with")} ${language === "en" ? friend.name.en : friend.name.hi}`,
    });
  };
  
  const handleCall = (friend: Friend) => {
    toast({
      title: t("calling"),
      description: `${t("voice_calling")} ${language === "en" ? friend.name.en : friend.name.hi}`,
    });
  };
  
  const handleVideoCall = (friend: Friend) => {
    toast({
      title: t("calling"),
      description: `${t("video_calling")} ${language === "en" ? friend.name.en : friend.name.hi}`,
    });
  };
  
  const filteredFriends = friendList.filter(friend => 
    (language === "en" 
      ? friend.name.en.toLowerCase().includes(searchQuery.toLowerCase())
      : friend.name.hi.includes(searchQuery)
    )
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isActive}
            onCheckedChange={handleBeaconToggle}
            id="beacon-mode"
          />
          <label 
            htmlFor="beacon-mode" 
            className="text-sm font-medium cursor-pointer"
          >
            {t("location_beacon")}
          </label>
        </div>
        <span className="text-xs text-muted-foreground">
          {isActive ? t("beacon_visible") : t("beacon_invisible")}
        </span>
      </div>
      
      <Input
        placeholder={t("search_friends")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      
      <div className="space-y-4">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div 
              key={friend.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border"
            >
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.image} alt={language === "en" ? friend.name.en : friend.name.hi} />
                    <AvatarFallback>
                      {language === "en" 
                        ? friend.name.en.charAt(0) 
                        : friend.name.hi.charAt(0)
                      }
                    </AvatarFallback>
                  </Avatar>
                  <span 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      friend.status === 'active' 
                        ? 'bg-green-500' 
                        : friend.status === 'away' 
                        ? 'bg-yellow-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">
                    {language === "en" ? friend.name.en : friend.name.hi}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {friend.status === 'active' 
                      ? t("active_now") 
                      : friend.lastSeen
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                {friend.isRequestSent ? (
                  <Button size="icon" variant="ghost" disabled>
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                ) : (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => handleChat(friend)}>
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleCall(friend)}>
                      <Phone className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleVideoCall(friend)}>
                      <Video className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleAddFriend(friend.id)}>
                      <UserPlus className="h-4 w-4 text-primary" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("no_matches_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFriends;
