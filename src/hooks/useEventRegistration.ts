
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

interface EventRegistration {
  id: string;
  user_id: string;
  activity_id: string;
  registered_at: string;
  reminder_sent?: boolean;
}

interface EventReminder {
  id: string;
  registration_id: string;
  reminder_time: string;
  sent: boolean;
  created_at: string;
}

export const useEventRegistration = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [reminders, setReminders] = useState<EventReminder[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const registerForEvent = async (eventId: string, eventTitle: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for events",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    
    try {
      // Check if already registered
      const { data: existingReg, error: checkError } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.uid)
        .eq('activity_id', eventId);

      if (checkError) throw checkError;

      if (existingReg && existingReg.length > 0) {
        toast({
          title: "Already Registered",
          description: `You're already registered for ${eventTitle}`,
        });
        return false;
      }

      // Create registration
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({
          user_id: user.uid,
          activity_id: eventId
        })
        .select()
        .single();

      if (regError) throw regError;

      // Get event details for reminder setup
      const { data: event, error: eventError } = await supabase
        .from('activities')
        .select('start_time, title')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error("Error fetching event details:", eventError);
      } else if (event?.start_time) {
        // Schedule reminders
        await scheduleEventReminders(registration.id, event.start_time, event.title);
      }

      // Send notification
      await supabase.functions.invoke('send-notification', {
        body: {
          userId: user.uid,
          title: "Registration Successful",
          message: `You've successfully registered for ${eventTitle}`,
          type: "registration"
        }
      });

      setRegistrations(prev => [...prev, registration]);

      toast({
        title: "Registration Successful",
        description: `You've registered for ${eventTitle}`,
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering for the event",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const scheduleEventReminders = async (
    registrationId: string, 
    eventStartTime: string, 
    eventTitle: string
  ) => {
    try {
      const eventDate = new Date(eventStartTime);
      const now = new Date();

      // Schedule reminders: 24 hours, 1 hour, and 15 minutes before event
      const reminderTimes = [
        new Date(eventDate.getTime() - 24 * 60 * 60 * 1000), // 24 hours before
        new Date(eventDate.getTime() - 60 * 60 * 1000),      // 1 hour before
        new Date(eventDate.getTime() - 15 * 60 * 1000),      // 15 minutes before
      ];

      for (const reminderTime of reminderTimes) {
        if (reminderTime > now) {
          // Create reminder record
          const { error } = await supabase
            .from('notifications')
            .insert({
              user_id: user?.uid,
              title: "Event Reminder",
              message: `Don't forget: ${eventTitle} starts in ${getTimeUntilEvent(reminderTime, eventDate)}`,
              type: "reminder",
              created_at: reminderTime.toISOString()
            });

          if (error) {
            console.error("Error scheduling reminder:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error scheduling reminders:", error);
    }
  };

  const getTimeUntilEvent = (reminderTime: Date, eventTime: Date): string => {
    const timeDiff = eventTime.getTime() - reminderTime.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 24) {
      return "24 hours";
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          activities (
            title,
            start_time,
            end_time,
            location,
            description
          )
        `)
        .eq('user_id', user.uid)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const isRegisteredForEvent = async (eventId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', user.uid)
        .eq('activity_id', eventId)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error("Error checking registration:", error);
      return false;
    }
  };

  const unregisterFromEvent = async (eventId: string, eventTitle: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('user_id', user.uid)
        .eq('activity_id', eventId);

      if (error) throw error;

      setRegistrations(prev => prev.filter(reg => reg.activity_id !== eventId));

      toast({
        title: "Unregistered Successfully",
        description: `You've been removed from ${eventTitle}`,
      });

      return true;
    } catch (error) {
      console.error("Unregistration error:", error);
      toast({
        title: "Error",
        description: "Failed to unregister from event",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  return {
    registrations,
    reminders,
    loading,
    registerForEvent,
    unregisterFromEvent,
    isRegisteredForEvent,
    fetchUserRegistrations,
  };
};
