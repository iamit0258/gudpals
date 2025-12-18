
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import SessionsList from "@/components/sessions/SessionsList";
import EventRegistration from "@/components/events/EventRegistration";
import { useSessionsService } from "@/hooks/useSessionsService";
import { useSessionRegistration } from "@/hooks/useSessionRegistration";
import { useEventRegistration } from "@/hooks/useEventRegistration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";


// Generate upcoming events with future dates
const generateUpcomingEvents = () => {
  const now = new Date();
  const events = [
    {
      id: "1",
      title: "Yoga for Seniors",
      time: "9:00 AM - 10:00 AM",
      location: "Community Center, Andheri",
      participants: 18,
      maxParticipants: 25,
      category: "health"
    },
    {
      id: "2",
      title: "Digital Skills Workshop",
      time: "11:00 AM - 12:30 PM",
      location: "Public Library, Bandra",
      participants: 12,
      maxParticipants: 20,
      category: "technology"
    },
    {
      id: "3",
      title: "Art and Craft Session",
      time: "3:00 PM - 4:30 PM",
      location: "Senior Center, Dadar",
      participants: 15,
      maxParticipants: 20,
      category: "creativity"
    },
    {
      id: "4",
      title: "Health Check-up Camp",
      time: "10:00 AM - 2:00 PM",
      location: "City Hospital, Malad",
      participants: 45,
      maxParticipants: 100,
      category: "health"
    }
  ];

  // Generate dates for the next 7 days (future dates)
  return events.map((event, index) => {
    const eventDate = new Date(now);
    eventDate.setDate(now.getDate() + index + 1);

    return {
      ...event,
      date: eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  });
};

const Sessions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { sessions, loading } = useSessionsService();
  const { handleSessionRegister } = useSessionRegistration();
  const { registrations, fetchUserRegistrations } = useEventRegistration();
  const [events, setEvents] = useState(generateUpcomingEvents());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: t("registration_successful"),
        description: `${t("registered_for")} ${location.state.activityName}`,
      });

      navigate(location.pathname, { replace: true });
    }

    // Check for event registration from sessionStorage
    const eventRegData = sessionStorage.getItem("event_registration");
    if (eventRegData) {
      try {
        const data = JSON.parse(eventRegData);
        toast({
          title: t("registration_successful"),
          description: `${t("registered_for")} ${data.title}`,
        });
        sessionStorage.removeItem("event_registration");
      } catch (error) {
        console.error("Error parsing event registration data:", error);
      }
    }
  }, [location, toast, navigate, t]);

  const handleEventRegister = (eventId: string) => {
    fetchUserRegistrations();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || event.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const myEvents = events.filter(event =>
    registrations.some(reg => reg.activity_id === event.id)
  );

  return (
    <MobileLayout>
      <div className="py-6">
        <div className="px-4 mb-6">
          <h1 className="text-3xl font-bold">{t("sessions")} & Events</h1>
        </div>

        <Tabs defaultValue="sessions" className="w-full">
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="sessions">{t("sessions")}</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </div>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <div className="px-4 space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">{t("upcoming_sessions")}</h2>
                <SessionsList
                  sessions={sessions}
                  loading={loading}
                  onRegister={handleSessionRegister}
                />
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
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
                    onRegister={() => handleEventRegister(event.id)}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">{t("no_events_found")}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Sessions;
