
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Games = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  // Check if user just registered for an activity
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Registration Successful",
        description: `You've been registered for ${location.state.activityName}`,
      });
      
      // Remove the state to prevent showing the toast again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const games = [
    {
      id: 1,
      title: "Virtual Tambola",
      description: "Join a fun game of housie with friends online.",
      players: 42,
      schedule: "Daily, 5:00 PM - 6:00 PM",
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=300&auto=format&fit=crop",
      category: "Social",
    },
    {
      id: 2,
      title: "Memory Match",
      description: "Test your memory with this classic card game.",
      players: 123,
      schedule: "Play anytime",
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=300&auto=format&fit=crop",
      category: "Brain Training",
    },
    {
      id: 3,
      title: "Word Puzzle",
      description: "Solve word puzzles to improve vocabulary.",
      players: 76,
      schedule: "New puzzles daily",
      image: "https://images.unsplash.com/photo-1628815113969-0509784aeede?q=80&w=300&auto=format&fit=crop",
      category: "Learning",
    },
  ];

  const handleGameRegister = (game: any) => {
    registerForActivity(
      "game",
      game.title,
      "/games"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Games & Activities</h1>
        
        <div className="space-y-4">
          {games.map((game) => (
            <Card key={game.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                  {game.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{game.title}</h3>
                <p className="text-sm text-dhayan-gray mt-1">{game.description}</p>
                
                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{game.players} players</span>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{game.schedule}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleGameRegister(game)}
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Play Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Games;
