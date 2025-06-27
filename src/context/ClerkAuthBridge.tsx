
import React, { createContext, useContext, ReactNode } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useUserSync } from "@/hooks/useUserSync";

// Define the User type to match your existing structure
interface User {
  uid: string;
  phoneNumber: string | null;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  createdAt?: string;
  lastLoginAt?: string;
}

// Define the context type to match your existing AuthContext
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<any>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (data: Partial<User>) => Promise<any>;
  isAuthenticated: boolean;
  registerForActivity: (
    activityType: string, 
    activityName: string, 
    redirectPath: string
  ) => void;
  register: (data: any) => Promise<{ error: any | null; status: string | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  sendOTP: async () => {},
  verifyOTP: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  isAuthenticated: false,
  registerForActivity: () => {},
  register: async () => ({ error: null, status: null }),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  
  // Sync user data to Supabase database
  useUserSync();

  // Transform Clerk user to match your existing User interface
  const user: User | null = clerkUser ? {
    uid: clerkUser.id,
    phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
    displayName: clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || clerkUser.username || null,
    email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
    photoURL: clerkUser.imageUrl || null,
    createdAt: clerkUser.createdAt?.toISOString(),
    lastLoginAt: clerkUser.lastSignInAt?.toISOString(),
  } : null;

  // Bridge functions to maintain compatibility
  const sendOTP = async (phoneNumber: string) => {
    // Clerk handles OTP internally, so this is mainly for compatibility
    console.log("OTP sending handled by Clerk for:", phoneNumber);
    return { success: true };
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    // Clerk handles OTP verification internally
    console.log("OTP verification handled by Clerk");
    return { user };
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!clerkUser) throw new Error("No user logged in");
      
      // Update Clerk user profile
      const updates: any = {};
      if (data.displayName) {
        const names = data.displayName.split(' ');
        updates.firstName = names[0];
        if (names.length > 1) {
          updates.lastName = names.slice(1).join(' ');
        }
      }
      
      await clerkUser.update(updates);
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const registerForActivity = (
    activityType: string,
    activityName: string,
    redirectPath: string
  ) => {
    // Store activity registration data for after authentication
    sessionStorage.setItem("dhayan_activity_registration", JSON.stringify({
      activityType,
      activityName,
      redirectPath
    }));
    
    // Redirect to sign up if not authenticated
    if (!user) {
      window.location.href = "/sign-up";
    }
  };

  const register = async (data: any) => {
    // Clerk handles registration through its components
    console.log("Registration handled by Clerk components");
    return { error: null, status: "success" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !isLoaded,
        sendOTP,
        verifyOTP,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
        registerForActivity,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
