
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Calendar, Users, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Travel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Trip Booked",
        description: `You've booked ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const trips = [
    {
      id: 1,
      title: "Heritage Tour of Rajasthan",
      description: "Explore the rich cultural heritage of Rajasthan with senior-friendly accommodations.",
      participants: 15,
      date: "Oct 15-22, 2023",
      image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=300&auto=format&fit=crop",
      category: "Cultural",
    },
    {
      id: 2,
      title: "Wellness Retreat in Kerala",
      description: "Rejuvenate your mind and body in the serene backwaters of Kerala.",
      participants: 12,
      date: "Nov 5-12, 2023",
      image: "https://images.unsplash.com/photo-1540247110674-31e928ee852a?q=80&w=300&auto=format&fit=crop",
      category: "Wellness",
    },
    {
      id: 3,
      title: "Himalayan Spiritual Journey",
      description: "Visit sacred temples and experience the spiritual energy of the Himalayas.",
      participants: 18,
      date: "Sep 20-30, 2023",
      image: "https://images.unsplash.com/photo-1550686041-366ad85a1355?q=80&w=300&auto=format&fit=crop",
      category: "Spiritual",
    },
  ];

  const handleBookTrip = (trip: any) => {
    registerForActivity(
      "trip",
      trip.title,
      "/travel"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Senior-Friendly Travel</h1>
        <p className="text-sm text-dhayan-gray">Discover specially curated trips for senior travelers</p>
        
        <div className="space-y-4">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={trip.image} 
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                  {trip.category}
                </div>
                <button className="absolute top-2 left-2 bg-white/80 p-1 rounded-full">
                  <Heart className="h-4 w-4 text-red-500" />
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{trip.title}</h3>
                <p className="text-sm text-dhayan-gray mt-1">{trip.description}</p>
                
                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{trip.date}</span>
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{trip.participants} travelers</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleBookTrip(trip)}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Travel;
