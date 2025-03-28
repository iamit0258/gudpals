
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define the User type
export interface User {
  uid: string;
  phoneNumber: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  sendOTP: async () => {},
  verifyOTP: async () => {},
  signOut: () => {},
  updateProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("dhayan_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("dhayan_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock OTP sending function
  const sendOTP = async (phoneNumber: string): Promise<void> => {
    // In a real app, this would call an API to send an OTP to the user's phone
    console.log(`Sending OTP to ${phoneNumber}`);
    // For demo purposes, we'll just simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store the phone number temporarily (in a real app, this might be done server-side)
        sessionStorage.setItem("dhayan_verify_phone", phoneNumber);
        // The OTP for demo purposes is always "123456"
        resolve();
      }, 1000);
    });
  };

  // Mock OTP verification function
  const verifyOTP = async (phoneNumber: string, otp: string): Promise<void> => {
    // In a real app, this would verify the OTP with a backend service
    console.log(`Verifying OTP ${otp} for ${phoneNumber}`);
    
    // For demo purposes, accept any 6-digit OTP
    if (otp.length === 6) {
      // Create a user account or sign in the user
      const newUser: User = {
        uid: `user_${Date.now()}`, // Generate a fake UID
        phoneNumber,
        displayName: null,
        email: null,
        photoURL: null,
      };
      
      setUser(newUser);
      localStorage.setItem("dhayan_user", JSON.stringify(newUser));
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Invalid OTP"));
    }
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("dhayan_user");
    toast({
      title: "Signed out successfully",
    });
    navigate("/");
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return Promise.reject(new Error("No authenticated user"));
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("dhayan_user", JSON.stringify(updatedUser));
    
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        sendOTP,
        verifyOTP,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
