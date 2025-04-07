
// Define the User type
export interface User {
  uid: string;
  phoneNumber: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

// Define the context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<any>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (data: Partial<User>) => Promise<any>;
  isAuthenticated: boolean;
  registerForActivity: (
    activityType: ActivityType, 
    activityName: string, 
    redirectPath: string
  ) => void;
}

// Re-export ActivityType from the service for convenience - fixed with export type
import { ActivityType } from "@/services/activityService";
export type { ActivityType };
