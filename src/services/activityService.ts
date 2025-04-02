import { User } from "@/context/auth/types";
import { supabase } from "@/integrations/supabase/client";

// Define the activity registration type
export interface ActivityRegistration {
  id: string;
  userId: string;
  activityType: string;
  activityName: string;
  registeredAt: string;
}

// Define the activity types
export type ActivityType = "session" | "game" | "learning" | "other" | "product" | "connection" | "course" | "activity" | "job" | "trip";

// Mock database for activities (will be replaced by Supabase)
const mockActivityDb: Record<string, ActivityRegistration[]> = {};

export const activityService = {
  // Register a user for an activity
  registerForActivity: async (
    user: User,
    activityType: ActivityType,
    activityName: string
  ): Promise<ActivityRegistration> => {
    try {
      // First, find the activity ID by name
      const { data: activities, error: activityError } = await supabase
        .from('activities')
        .select('id')
        .eq('title', activityName)
        .eq('activity_type', activityType)
        .limit(1);
        
      if (activityError) throw activityError;
      
      if (!activities || activities.length === 0) {
        // If activity not found, fall back to mock registration
        console.log("Activity not found in database, using mock registration");
        const newRegistration: ActivityRegistration = {
          id: `reg_${Date.now()}`,
          userId: user.uid,
          activityType,
          activityName,
          registeredAt: new Date().toISOString(),
        };
        
        if (!mockActivityDb[user.uid]) {
          mockActivityDb[user.uid] = [];
        }
        
        mockActivityDb[user.uid].push(newRegistration);
        console.log("New mock activity registration:", newRegistration);
        
        return newRegistration;
      }
      
      // Activity found, register user
      const activityId = activities[0].id;
      
      // Check if already registered
      const { data: existingReg, error: checkError } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.uid)
        .eq('activity_id', activityId);
      
      if (checkError) throw checkError;
      
      if (existingReg && existingReg.length > 0) {
        // Already registered, return existing registration
        const existing = existingReg[0];
        return {
          id: existing.id,
          userId: existing.user_id,
          activityType,
          activityName,
          registeredAt: existing.registered_at
        };
      }
      
      // Create new registration
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .insert({
          user_id: user.uid,
          activity_id: activityId
        })
        .select()
        .single();
        
      if (regError) throw regError;
      
      console.log("New Supabase activity registration:", regData);
      
      // Return formatted registration
      return {
        id: regData.id,
        userId: regData.user_id,
        activityType,
        activityName,
        registeredAt: regData.registered_at
      };
    } catch (error) {
      console.error("Error registering for activity:", error);
      throw error;
    }
  },

  // Get user's registered activities
  getUserActivities: async (userId: string): Promise<ActivityRegistration[]> => {
    try {
      // Get registrations from Supabase
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select(`
          id,
          registered_at,
          activities (
            id,
            title,
            activity_type
          )
        `)
        .eq('user_id', userId);
      
      if (regError) throw regError;
      
      if (!registrations || registrations.length === 0) {
        // Fall back to mock data if no registrations found
        return mockActivityDb[userId] || [];
      }
      
      // Format the registrations
      return registrations.map(reg => ({
        id: reg.id,
        userId: userId,
        activityType: reg.activities?.activity_type as ActivityType || "other",
        activityName: reg.activities?.title || "Unknown activity",
        registeredAt: reg.registered_at
      }));
    } catch (error) {
      console.error("Error fetching user activities:", error);
      
      // Fall back to mock data on error
      return mockActivityDb[userId] || [];
    }
  },

  // Check if user is registered for a specific activity
  isRegisteredForActivity: async (
    userId: string,
    activityName: string
  ): Promise<boolean> => {
    try {
      // First, find the activity ID by name
      const { data: activities, error: activityError } = await supabase
        .from('activities')
        .select('id')
        .eq('title', activityName)
        .limit(1);
        
      if (activityError) throw activityError;
      
      if (!activities || activities.length === 0) {
        // Activity not found in database, check mock data
        const activities = mockActivityDb[userId] || [];
        return activities.some(
          (activity) => activity.activityName === activityName
        );
      }
      
      const activityId = activities[0].id;
      
      // Check if registered
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_id', activityId)
        .limit(1);
      
      if (regError) throw regError;
      
      return registrations && registrations.length > 0;
    } catch (error) {
      console.error("Error checking registration status:", error);
      
      // Fall back to mock data on error
      const activities = mockActivityDb[userId] || [];
      return activities.some(
        (activity) => activity.activityName === activityName
      );
    }
  }
};
