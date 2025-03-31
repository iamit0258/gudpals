
import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, MessageCircle } from "lucide-react";

const Learn = () => {
  const friends = [
    {
      id: 1,
      name: "Rajesh Kumar",
      age: 65,
      location: "Andheri, Mumbai",
      distance: "2.5 km away",
      interests: ["Yoga", "Reading", "Walking"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
      online: true
    },
    {
      id: 2,
      name: "Sunita Sharma",
      age: 62,
      location: "Bandra, Mumbai",
      distance: "5 km away",
      interests: ["Cooking", "Gardening", "Music"],
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60",
      online: false
    },
    {
      id: 3,
      name: "Prakash Mehta",
      age: 70,
      location: "Powai, Mumbai",
      distance: "8 km away",
      interests: ["Chess", "History", "Technology"],
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=500&auto=format&fit=crop&q=60",
      online: true
    },
    {
      id: 4,
      name: "Lakshmi Iyer",
      age: 68,
      location: "Dadar, Mumbai",
      distance: "10.2 km away",
      interests: ["Tambola", "Travel", "Cooking"],
      image: "https://images.unsplash.com/photo-1551863863-e01bbf274ef6?w=500&auto=format&fit=crop&q=60",
      online: false
    }
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gudpals-green-dark">GUDPALS Friends Nearby</h1>
        <p className="text-sm text-gudpals-gray">Connect with other seniors in your area who are using the GUDPALS app.</p>
        
        <div className="space-y-4 mt-6">
          {friends.map((friend) => (
            <Card key={friend.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="relative mr-3">
                    <img 
                      src={friend.image} 
                      alt={friend.name} 
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    {friend.online && (
                      <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{friend.name}</h3>
                        <p className="text-sm text-gudpals-gray">{friend.age} years</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        Connect
                      </Button>
                    </div>
                    
                    <div className="flex items-center mt-2 text-xs text-gudpals-gray-dark">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{friend.distance}</span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {friend.interests.map((interest, idx) => (
                        <span key={idx} className="text-xs bg-gudpals-green/10 text-gudpals-green px-2 py-0.5 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-xs mt-2 h-8 text-gudpals-green">
                      <MessageCircle className="h-3.5 w-3.5 mr-1" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Learn;
