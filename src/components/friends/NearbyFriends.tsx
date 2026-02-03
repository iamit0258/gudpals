
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radio } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { useEffect } from "react";

const NearbyFriends = () => {
  const { user: currentUser } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchRealProfiles = async () => {
      try {
        setLoading(true);
        // Fetch up to 10 profiles that are NOT the current user
        const { data, error } = await supabase
          .from('profiles')
          .select('id, display_name, photo_url, location, interests')
          .neq('id', currentUser?.uid)
          .limit(10);

        if (error) {
          console.error("Error fetching profiles:", error);
          // Fallback to empty if RLS prevents view
          setSuggestions([]);
          return;
        }

        if (data) {
          // Map real DB fields to our UI structure
          const formatted = data.map(p => ({
            id: p.id,
            name: p.display_name || "GUDPALS User",
            interests: p.interests || ["Yoga", "Community"],
            reason: p.location ? `Lives in ${p.location}` : "New member",
            image: p.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`
          }));
          setSuggestions(formatted);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchRealProfiles();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleConnect = (name: string) => {
    toast({
      title: "Request Sent",
      description: `Connection request sent to ${name}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Suggested Friends Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Suggested for You</h2>
          <span className="text-xs text-primary font-medium cursor-pointer flex items-center">
            View All <Radio className="h-3 w-3 ml-1" />
          </span>
        </div>

        {suggestions.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {suggestions.map((person) => (
              <Card key={person.id} className="w-48 flex-shrink-0 shadow-md border-none overflow-hidden transition-all hover:shadow-lg">
                <div className="h-20 bg-gradient-to-br from-primary/20 to-teal-100 flex items-center justify-center pt-4">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
                    <AvatarImage src={person.image} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="p-4 pt-8 text-center">
                  <h4 className="font-bold text-sm text-gray-800 truncate">{person.name}</h4>
                  <p className="text-[10px] text-primary mb-3 bg-primary/10 py-1 rounded-full px-2 inline-block">
                    {person.reason}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center mb-4 min-h-[40px]">
                    {person.interests.slice(0, 2).map(interest => (
                      <span key={interest} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-primary hover:bg-dhayan-teal-dark"
                    onClick={() => handleConnect(person.name)}
                  >
                    Say Hi
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500">No other members found yet.</p>
            <p className="text-[10px] text-slate-400 mt-1">Check back later as the community grows!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFriends;
