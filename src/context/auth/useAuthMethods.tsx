
import { useState } from "react";
import { User } from "./types";

type SetUserFunction = React.Dispatch<React.SetStateAction<User | null>>;

// Update ToastInterface to match the actual shape used by the toast function
export interface ToastInterface {
  toast: (props: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => void;
}

export const useAuthMethods = (
  user: User | null,
  setUser: SetUserFunction,
  { toast }: ToastInterface,
  navigate: any
) => {
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
      // Check if this is a signup flow
      const signupData = sessionStorage.getItem("dhayan_signup_data");
      let userData: Partial<User> = {};
      
      if (signupData) {
        try {
          userData = JSON.parse(signupData);
          // Clear the signup data after successful verification
          sessionStorage.removeItem("dhayan_signup_data");
        } catch (error) {
          console.error("Error parsing signup data:", error);
        }
      }
      
      // Create a user account or sign in the user
      const newUser: User = {
        uid: `user_${Date.now()}`, // Generate a fake UID
        phoneNumber,
        displayName: userData.displayName || null,
        email: userData.email || null,
        photoURL: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
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

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return Promise.reject(new Error("No authenticated user"));
    
    const updatedUser = { ...user, ...data, lastLoginAt: new Date().toISOString() };
    setUser(updatedUser);
    localStorage.setItem("dhayan_user", JSON.stringify(updatedUser));
    
    return Promise.resolve();
  };

  return {
    sendOTP,
    verifyOTP,
    signOut,
    updateProfile
  };
};
