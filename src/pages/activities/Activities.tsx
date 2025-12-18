
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/context/auth";

const Activities = () => {
  const { registerForActivity, user } = useAuth();
  const navigate = useNavigate();

  const activities = [
    {
      id: 1,
      title: "Gardening Club",
      description: "Join fellow gardening enthusiasts to share tips and grow together.",
      participants: 24,
      schedule: "Every Saturday, 9:00 AM",
      location: "Community Garden",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Art Workshop",
      description: "Express your creativity through painting and crafts.",
      participants: 18,
      schedule: "Tuesdays & Thursdays, 3:00 PM",
      location: "Art Studio, Block A",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Book Club",
      description: "Discuss your favorite books with fellow readers.",
      participants: 32,
      schedule: "First Monday, 4:00 PM",
      location: "Library Hall",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Walking Group",
      description: "Stay active with morning walks in the park.",
      participants: 45,
      schedule: "Daily, 6:30 AM",
      location: "Central Park",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=300&auto=format&fit=crop",
    },
  ];

  const handleActivityJoin = (activity: any) => {
    if (!user) {
      navigate('/register', { state: { from: '/activities' } });
      return;
    }

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
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{activity.title}</h3>
                <p className="text-sm text-dhayan-gray mt-1">{activity.description}</p>

                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{activity.participants} participants</span>
                  <Calendar className="h-3.5 w-3.5 mr-1" />
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
                  <Users className="h-4 w-4 mr-2" />
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
