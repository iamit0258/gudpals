
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Filter, Clock, Calendar, 
  Users, ChevronRight 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";

const SessionsPage = () => {
  const categories = ["All", "Yoga", "Fitness", "Health", "Arts", "Entertainment", "Digital"];
  
  const sessions = [
    {
      id: 1,
      title: "Morning Yoga for Seniors",
      instructor: "Anjali Sharma",
      time: "8:00 AM",
      date: "Tomorrow",
      category: "Yoga",
      difficulty: "Beginner",
      participants: 24,
      image: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Smartphone Basics",
      instructor: "Raj Kumar",
      time: "11:00 AM",
      date: "Today",
      category: "Digital",
      difficulty: "Beginner",
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
      difficulty: "All Levels",
      participants: 42,
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Health Check-up Basics",
      instructor: "Dr. Priya Singh",
      time: "10:00 AM",
      date: "Thursday",
      category: "Health",
      difficulty: "All Levels",
      participants: 30,
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Art & Craft Workshop",
      instructor: "Neha Kapoor",
      time: "2:00 PM",
      date: "Friday",
      category: "Arts",
      difficulty: "Intermediate",
      participants: 18,
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=300&auto=format&fit=crop"
    }
  ];
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Yoga":
        return "bg-dhayan-green text-green-800";
      case "Digital":
        return "bg-dhayan-orange text-orange-800";
      case "Entertainment":
        return "bg-dhayan-purple-light text-dhayan-purple-dark";
      case "Health":
        return "bg-dhayan-pink text-rose-800";
      case "Arts":
        return "bg-blue-100 text-blue-800";
      case "Fitness":
        return "bg-red-100 text-red-800";
      default:
        return "bg-dhayan-yellow text-amber-800";
    }
  };
  
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Live Sessions</h1>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search sessions..." 
              className="pl-8 bg-white text-large" 
            />
          </div>
          <Button variant="outline" size="icon" className="bg-white">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs defaultValue="All">
          <TabsList className="w-full overflow-auto py-1 justify-start mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="text-large"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="space-y-4">
                {sessions.filter(session => 
                  category === "All" || session.category === category
                ).map(session => (
                  <Card key={session.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3">
                        <img
                          src={session.image} 
                          alt={session.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="w-2/3 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{session.title}</h3>
                          <Badge 
                            className={getCategoryColor(session.category)}
                            variant="outline"
                          >
                            {session.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {session.instructor}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{session.participants}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-dhayan-purple"
                        >
                          Join Session <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default SessionsPage;
