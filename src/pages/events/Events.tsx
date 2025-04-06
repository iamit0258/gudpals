
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import EventRegistration from "@/components/events/EventRegistration";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";

// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Yoga for Seniors",
    date: "15 April 2025",
    time: "9:00 AM - 10:00 AM",
    location: "Community Center, Andheri",
    participants: 18,
    maxParticipants: 25,
    category: "health"
  },
  {
    id: "2",
    title: "Digital Skills Workshop",
    date: "17 April 2025",
    time: "11:00 AM - 12:30 PM",
    location: "Public Library, Bandra",
    participants: 12,
    maxParticipants: 20,
    category: "technology"
  },
  {
    id: "3",
    title: "Art and Craft Session",
    date: "20 April 2025",
    time: "3:00 PM - 4:30 PM",
    location: "Senior Center, Dadar",
    participants: 15,
    maxParticipants: 20,
    category: "creativity"
  },
  {
    id: "4",
    title: "Health Check-up Camp",
    date: "25 April 2025",
    time: "10:00 AM - 2:00 PM",
    location: "City Hospital, Malad",
    participants: 45,
    maxParticipants: 100,
    category: "health"
  }
];

const Events = () => {
  const [events, setEvents] = useState(mockEvents);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  const { t } = useLanguage();
  const location = useLocation();
  
  // Check if the user just registered for an event (coming from login/register flow)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const registeredParam = params.get("registered");
    const eventName = params.get("event");
    
    if (registeredParam === "true" && eventName) {
      toast({
        title: t("registration_successful"),
        description: `${t("registered_for")} ${eventName}`,
      });
      
      // Find the event by name and add to registered events
      const event = events.find(e => e.title === eventName);
      if (event) {
        setRegisteredEvents(prev => [...prev, event.id]);
      }
    }
  }, [location, toast, t, events]);
  
  const handleRegister = (eventId: string) => {
    setRegisteredEvents(prev => [...prev, eventId]);
  };
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || event.category === activeFilter;
    return matchesSearch && matchesFilter;
  });
  
  const myEvents = events.filter(event => registeredEvents.includes(event.id));
  
  return (
    <MobileLayout>
      <div className="py-6">
        <div className="px-4 flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("events")}</h1>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="upcoming">{t("upcoming_events")}</TabsTrigger>
              <TabsTrigger value="registered">{t("your_events")}</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upcoming">
            <div className="px-4 mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    className="pl-10"
                    placeholder={t("search_events")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button 
                  variant={activeFilter === "all" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveFilter("all")}
                >
                  {t("all")}
                </Button>
                <Button 
                  variant={activeFilter === "health" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveFilter("health")}
                >
                  {t("health")}
                </Button>
                <Button 
                  variant={activeFilter === "technology" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveFilter("technology")}
                >
                  {t("technology")}
                </Button>
                <Button 
                  variant={activeFilter === "creativity" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveFilter("creativity")}
                >
                  {t("creativity")}
                </Button>
              </div>
            </div>
            
            <div className="px-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventRegistration
                    key={event.id}
                    eventId={event.id}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    participants={event.participants}
                    maxParticipants={event.maxParticipants}
                    isRegistered={registeredEvents.includes(event.id)}
                    onRegister={() => handleRegister(event.id)}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">{t("no_events_found")}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="registered">
            <div className="px-4">
              {myEvents.length > 0 ? (
                myEvents.map(event => (
                  <EventRegistration
                    key={event.id}
                    eventId={event.id}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    participants={event.participants}
                    maxParticipants={event.maxParticipants}
                    isRegistered={true}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">{t("no_registered_events")}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Events;
