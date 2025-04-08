
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Video, UserPlus, Check, MapPin, Beacon } from "lucide-react";
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
  location?: string;
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
    distance: "2.3 km",
    location: "Old Delhi Train Station"
  },
  {
    id: "2",
    name: {
      en: "Anuradha Gupta",
      hi: "अनुराधा गुप्ता"
    },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
    status: "active",
    distance: "3.7 km",
    location: "Connaught Place"
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
  },
  {
    id: "5",
    name: {
      en: "Rahul Verma",
      hi: "राहुल वर्मा"
    },
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&q=80",
    status: "active",
    distance: "1.5 km",
    location: "Janpath Market"
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

  // Filter nearby friends if beacon is active
  const nearbyFriends = isActive 
    ? filteredFriends.filter(friend => friend.distance)
    : [];
  
  const displayedFriends = isActive ? nearbyFriends : filteredFriends;
  
  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center justify-between">
        <div className="relative inline-flex">
          <Switch 
            checked={isActive}
            onCheckedChange={handleBeaconToggle}
            id="beacon-mode"
            className="z-10"
          />
          {isActive && (
            <>
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></span>
              <span className="absolute inset-[-4px] rounded-full bg-primary/10 beacon-pulse"></span>
              <span className="absolute inset-[-8px] rounded-full bg-primary/5"></span>
            </>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {isActive ? t("beacon_visible") : t("beacon_invisible")}
        </span>
      </div>
      
      <Input
        placeholder={t("search_friends")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      
      {!isActive && (
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <Beacon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">{t("beacon_required")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("activate_beacon_message")}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => handleBeaconToggle(true)}
          >
            {t("activate_beacon")}
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {displayedFriends.length > 0 ? (
          displayedFriends.map((friend) => (
            <div 
              key={friend.id}
              className="flex flex-col p-4 bg-white rounded-lg border"
            >
              <div className="flex items-center justify-between">
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
                
                {friend.distance && (
                  <div className="flex items-center text-sm text-primary">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{friend.distance}</span>
                  </div>
                )}
              </div>
              
              {friend.location && (
                <div className="mt-2 mb-3 px-2 py-1 bg-muted/30 rounded text-xs text-muted-foreground inline-flex items-center self-start">
                  <MapPin className="h-3 w-3 mr-1" />
                  {friend.location}
                </div>
              )}
              
              <div className="flex justify-end space-x-1 mt-2">
                {friend.isRequestSent ? (
                  <Button size="sm" variant="outline" disabled className="text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    {t("request_sent")}
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleAddFriend(friend.id)}
                      className="flex items-center"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      {t("add")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          isActive && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("no_nearby_friends")}</p>
              <p className="text-xs text-muted-foreground mt-2">{t("invite_friends")}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NearbyFriends;
