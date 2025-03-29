
import { User } from "@/context/auth/types";

// Define the activity registration type
export interface ActivityRegistration {
  id: string;
  userId: string;
  activityType: string;
  activityName: string;
  registeredAt: string;
}

// Define the activity types
export type ActivityType = "session" | "game" | "learning" | "other";

// Mock database for activities
const mockActivityDb: Record<string, ActivityRegistration[]> = {};

export const activityService = {
  // Register a user for an activity
  registerForActivity: (
    user: User,
    activityType: ActivityType,
    activityName: string
  ): Promise<ActivityRegistration> => {
    return new Promise((resolve) => {
      // Create new registration
      const newRegistration: ActivityRegistration = {
        id: `reg_${Date.now()}`,
        userId: user.uid,
        activityType,
        activityName,
        registeredAt: new Date().toISOString(),
      };

      // Store in our mock database
      if (!mockActivityDb[user.uid]) {
        mockActivityDb[user.uid] = [];
      }
      
      mockActivityDb[user.uid].push(newRegistration);
      console.log("New activity registration:", newRegistration);
      
      // Simulate API delay
      setTimeout(() => resolve(newRegistration), 300);
    });
  },

  // Get user's registered activities
  getUserActivities: (userId: string): Promise<ActivityRegistration[]> => {
    return new Promise((resolve) => {
      const activities = mockActivityDb[userId] || [];
      
      // Simulate API delay
      setTimeout(() => resolve(activities), 300);
    });
  },

  // Check if user is registered for a specific activity
  isRegisteredForActivity: (
    userId: string,
    activityName: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const activities = mockActivityDb[userId] || [];
      const isRegistered = activities.some(
        (activity) => activity.activityName === activityName
      );
      
      // Simulate API delay
      setTimeout(() => resolve(isRegistered), 300);
    });
  }
};
