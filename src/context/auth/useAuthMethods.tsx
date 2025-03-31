
import { useState } from "react";
import { User } from "./types";
import { supabase } from "@/integrations/supabase/client";

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
  // Send OTP via Supabase phone auth
  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      console.log(`Sending OTP to ${phoneNumber}`);
      
      // In a real implementation, we would use Supabase phone auth
      // For now, we'll use our mock implementation
      sessionStorage.setItem("dhayan_verify_phone", phoneNumber);
      
      // Eventually replace with Supabase phone auth when enabled
      // const { error } = await supabase.auth.signInWithOtp({
      //   phone: phoneNumber
      // });
      // if (error) throw error;
      
      return Promise.resolve();
    } catch (error) {
      console.error("OTP send error:", error);
      return Promise.reject(error);
    }
  };

  // Verify OTP
  const verifyOTP = async (phoneNumber: string, otp: string): Promise<void> => {
    try {
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
        
        // In a real implementation, we would verify with Supabase
        // For now, create a mock user
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
    } catch (error) {
      console.error("OTP verification error:", error);
      return Promise.reject(error);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // For future integration with Supabase
      // await supabase.auth.signOut();
      
      setUser(null);
      localStorage.removeItem("dhayan_user");
      toast({
        title: "Signed out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return Promise.reject(new Error("No authenticated user"));
    
    try {
      // In future Supabase integration, update profile in database
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({
      //     display_name: data.displayName,
      //     email: data.email,
      //     photo_url: data.photoURL,
      //     last_login_at: new Date().toISOString()
      //   })
      //   .eq('id', user.uid);
      // if (error) throw error;
      
      const updatedUser = { ...user, ...data, lastLoginAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem("dhayan_user", JSON.stringify(updatedUser));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Profile update error:", error);
      return Promise.reject(error);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    signOut,
    updateProfile
  };
};
