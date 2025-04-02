
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Users, CalendarDays, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Activities = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Registration Successful",
        description: `You've registered for ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const activities = [
    {
      id: 1,
      title: "Art & Craft Workshop",
      description: "Express your creativity through various art and craft activities.",
      participants: 24,
      schedule: "Every Tuesday, 4:00 PM",
      location: "Community Center",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=300&auto=format&fit=crop",
      category: "Creative",
    },
    {
      id: 2,
      title: "Senior Gardening Club",
      description: "Join fellow gardening enthusiasts and learn new techniques.",
      participants: 32,
      schedule: "Weekends, 9:00 AM",
      location: "Botanical Gardens",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=300&auto=format&fit=crop",
      category: "Outdoors",
    },
    {
      id: 3,
      title: "Book Reading Circle",
      description: "Discuss interesting books and share your thoughts with others.",
      participants: 18,
      schedule: "Every Friday, 5:00 PM",
      location: "Public Library",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=300&auto=format&fit=crop",
      category: "Learning",
    },
  ];

  const handleActivityJoin = (activity: any) => {
    registerForActivity(
      "activity",
      activity.title,
      "/activities"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Activities</h1>
        <p className="text-sm text-dhayan-gray">Discover engaging activities to keep you active and connected</p>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                  {activity.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{activity.title}</h3>
                <p className="text-sm text-dhayan-gray mt-1">{activity.description}</p>
                
                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{activity.participants} participants</span>
                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                  <span>{activity.schedule}</span>
                </div>
                <div className="flex items-center mt-1 text-xs text-dhayan-gray-dark">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{activity.location}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleActivityJoin(activity)}
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  Join Activity
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Activities;
