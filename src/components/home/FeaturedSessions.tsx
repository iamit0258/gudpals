
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users } from "lucide-react";

const FeaturedSessions = () => {
  const featuredSessions = [
    {
      id: 1,
      title: "Morning Yoga for Seniors",
      instructor: "Anjali Sharma",
      time: "8:00 AM",
      date: "Tomorrow",
      category: "Yoga",
      participants: 24,
      image: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Smartphone Basics",
      instructor: "Raj Kumar",
      time: "11:00 AM",
      date: "Today",
      category: "Digital Literacy",
      participants: 15,
      image: "https://images.unsplash.com/photo-1601784551062-20c13f969c4c?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Tambola Evening",
      instructor: "Meera Patel",
      time: "4:00 PM",
      date: "Today",
      category: "Entertainment",
      participants: 42,
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Online Safety Workshop",
      instructor: "Sanjay Gupta",
      time: "2:00 PM",
      date: "Tomorrow",
      category: "Safety",
      participants: 18,
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=300&auto=format&fit=crop"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Yoga":
        return "bg-dhayan-green text-green-800";
      case "Digital Literacy":
        return "bg-dhayan-orange text-orange-800";
      case "Entertainment":
        return "bg-dhayan-purple-light text-dhayan-purple-dark";
      case "Safety":
        return "bg-dhayan-pink text-rose-800";
      default:
        return "bg-dhayan-yellow text-amber-800";
    }
  };

  return (
    <ScrollArea className="-mx-4 px-4">
      <div className="flex space-x-4 pb-4">
        {featuredSessions.map((session) => (
          <Card 
            key={session.id} 
            className="w-64 flex-shrink-0 overflow-hidden cursor-pointer transition-transform hover:scale-105"
          >
            <div className="relative h-32">
              <img
                src={session.image} 
                alt={session.title}
                className="object-cover w-full h-full"
              />
              <Badge 
                className={`absolute top-2 left-2 ${getCategoryColor(session.category)}`}
                variant="outline"
              >
                {session.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">{session.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                by {session.instructor}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span className="mr-3">{session.time}</span>
                <Calendar className="h-3 w-3 mr-1" />
                <span>{session.date}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Users className="h-3 w-3 mr-1" />
                <span>{session.participants} participants</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default FeaturedSessions;
