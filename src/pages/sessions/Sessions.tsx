import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const Sessions = () => {
  const upcomingSessions = [
    {
      id: 1,
      title: "Morning Yoga",
      instructor: "Dr. Priya Sharma",
      time: "8:00 AM - 9:00 AM",
      date: "Today",
      category: "Yoga",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Meditation Class",
      instructor: "Raj Patel",
      time: "4:00 PM - 5:00 PM",
      date: "Today",
      category: "Wellness",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Chair Exercises",
      instructor: "Anita Desai",
      time: "10:00 AM - 11:00 AM",
      date: "Tomorrow",
      category: "Fitness",
      image: "/placeholder.svg",
    },
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Your Sessions</h1>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={session.image} 
                      alt={session.title} 
                      className="h-full object-cover"
                    />
                  </div>
                  <CardContent className="w-2/3 p-3">
                    <div className="mb-1">
                      <span className="text-xs bg-dhayan-purple-light text-dhayan-purple-dark px-2 py-0.5 rounded-full">
                        {session.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base">{session.title}</h3>
                    <p className="text-sm text-dhayan-gray">{session.instructor}</p>
                    <div className="flex items-center mt-2 text-sm text-dhayan-gray-dark">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{session.date}</span>
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      <span>{session.time}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Recommended For You</h2>
          {/* Similar card layout for recommended sessions */}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Sessions;
