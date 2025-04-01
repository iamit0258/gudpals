
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Friends = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Connection Request Sent",
        description: `You've sent a connection request to ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const friends = [
    {
      id: 1,
      name: "Raj Kapoor",
      description: "Retired teacher, interested in gardening and reading",
      distance: "1.2 km away",
      joinedDate: "Member since 2022",
      image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=300&auto=format&fit=crop",
      interests: "Book Club",
    },
    {
      id: 2,
      name: "Parvati Sharma",
      description: "Former doctor, loves yoga and classical music",
      distance: "3.5 km away",
      joinedDate: "Member since 2021",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
      interests: "Yoga",
    },
    {
      id: 3,
      name: "Mohan Singh",
      description: "Retired bank manager, enjoys playing cards and cooking",
      distance: "0.8 km away",
      joinedDate: "Member since 2023",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=300&auto=format&fit=crop",
      interests: "Cooking",
    },
  ];

  const handleConnect = (friend: any) => {
    registerForActivity(
      "connection",
      friend.name,
      "/friends"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Nearby Friends</h1>
        <p className="text-sm text-dhayan-gray">Connect with other GUDPALS users near you</p>
        
        <div className="space-y-4">
          {friends.map((friend) => (
            <Card key={friend.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={friend.image} 
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{friend.name}</h3>
                      <span className="bg-dhayan-purple-light text-dhayan-purple text-xs px-2 py-1 rounded-full">
                        {friend.interests}
                      </span>
                    </div>
                    <p className="text-sm text-dhayan-gray mt-1">{friend.description}</p>
                    
                    <div className="flex items-center mt-2 text-xs text-dhayan-gray-dark">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span className="mr-3">{friend.distance}</span>
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>{friend.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button 
                  className="flex-1 bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleConnect(friend)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-dhayan-purple text-dhayan-purple hover:bg-dhayan-purple/10"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Friends;
