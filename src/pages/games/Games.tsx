
import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, Trophy } from "lucide-react";

const Games = () => {
  const games = [
    {
      id: 1,
      title: "Tambola (Housie)",
      players: "25+ playing now",
      image: "/placeholder.svg",
      featured: true,
    },
    {
      id: 2,
      title: "Memory Match",
      players: "12+ playing now",
      image: "/placeholder.svg",
      featured: false,
    },
    {
      id: 3,
      title: "Word Search",
      players: "18+ playing now",
      image: "/placeholder.svg",
      featured: false,
    },
    {
      id: 4,
      title: "Sudoku",
      players: "30+ playing now",
      image: "/placeholder.svg",
      featured: false,
    },
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Games & Entertainment</h1>
        
        {/* Featured Game */}
        <Card className="bg-gradient-to-r from-dhayan-purple to-dhayan-purple-dark text-white overflow-hidden">
          <div className="relative h-40">
            <img 
              src="/placeholder.svg" 
              alt="Tambola Live Game" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-white text-dhayan-purple-dark text-xs px-2 py-1 rounded-full font-medium">LIVE NOW</span>
                  <h2 className="text-xl font-bold mt-2">Tambola Friday Special</h2>
                </div>
                <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">45+ players</span>
                </div>
                <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="text-sm">₹500 Prize</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* All Games */}
        <div>
          <h2 className="text-lg font-medium mb-3">All Games</h2>
          <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
              <Card key={game.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="text-white font-medium">{game.title}</h3>
                    <div className="flex items-center text-white/80 text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {game.players}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Games;
