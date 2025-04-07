
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "./types";
import { ToastProps as Toast } from "@/components/ui/toast";

// Define the ToastInterface type more specifically
export interface ToastInterface {
  toast: (props: Toast) => { 
    id: string; 
    dismiss: () => void; 
    update: (props: any) => void;
  };
  dismiss?: (toastId?: string) => void;
  toasts?: any[];
}

export const useAuthMethods = (
  currentUser?: User | null,
  setUser?: React.Dispatch<React.SetStateAction<User | null>>,
  toastInterface?: ToastInterface,
  navigate?: ReturnType<typeof useNavigate>
) => {
  const [loading, setLoading] = useState(false);
  const defaultNavigate = useNavigate();
  const nav = navigate || defaultNavigate;
  const toastUtil = toastInterface || useToast();
  
  // Helper function to safely use toast
  const showToast = (props: Toast) => {
    // Check if toastUtil has a toast function
    if (toastUtil && typeof toastUtil.toast === 'function') {
      toastUtil.toast(props);
    }
  };
  
  const loginWithPhoneOTP = async (phoneNumber: string) => {
    try {
      setLoading(true);
      
      // Demo mode: normally this would call supabase.auth.signInWithOtp
      // But for this demo, we'll just simulate it
      console.log("Sending OTP to:", phoneNumber);
      
      // Return success after a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error: any) {
      console.error("Error sending OTP:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      setLoading(true);
      
      // Demo mode: normally this would call supabase.auth.verifyOtp
      console.log("Verifying OTP:", otp, "for phone:", phoneNumber);
      
      // Return a mock user after a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a temporary user id for demo purposes
      const userId = `user_${Date.now()}`;
      
      // For demo purposes, just return a mock user object
      const user = {
        uid: userId,
        phoneNumber,
        displayName: null,
        isAnonymous: false,
      };
      
      // Check if there's any signup/registration data in session storage
      const signupData = sessionStorage.getItem("dhayan_signup_data");
      if (signupData) {
        const parsedData = JSON.parse(signupData);
        
        // For demo, we would update the user profile in Supabase here
        console.log("Updating user profile with:", parsedData);
        
        try {
          // Try to register for an activity if this was part of a registration flow
          if (parsedData.activityType && parsedData.activityName) {
            const { error } = await supabase
              .from('registrations')
              .insert({
                user_id: userId,
                activity_id: parsedData.activityId,
              });
              
            if (error) throw error;
            
            // Use the showToast helper function to show the registration success message
            showToast({
              title: "Registration successful",
              description: `You've registered for ${parsedData.activityName}`,
            });
          }
        } catch (error) {
          console.error("Registration error:", error);
        }
        
        // Clear signup data from session storage
        sessionStorage.removeItem("dhayan_signup_data");
      }
      
      // Set user if setUser function is provided
      if (setUser) {
        setUser(user);
      }
      
      // Return the user
      return { user };
    } catch (error: any) {
      console.error("Error verifying OTP:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would call supabase.auth.signOut()
      console.log("Logging out user");
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user if setUser function is provided
      if (setUser) {
        setUser(null);
      }
      
      // Redirect to login page
      nav("/login");
      
      return { success: true };
    } catch (error: any) {
      console.error("Error logging out:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const sendOTP = async (phoneNumber: string) => {
    return loginWithPhoneOTP(phoneNumber);
  };
  
  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      
      // In a real app, we would update the user profile in Supabase
      console.log("Updating user profile with:", data);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user if both currentUser and setUser are provided
      if (currentUser && setUser) {
        setUser({
          ...currentUser,
          ...data
        });
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const registerForActivity = (
    activityType: string,
    activityName: string,
    redirectPath: string,
    activityId?: string
  ) => {
    // Redirect to registration page with activity details
    nav("/register", {
      state: {
        activityType,
        activityName,
        activityId,
        from: redirectPath,
      },
    });
  };
  
  return {
    loading,
    loginWithPhoneOTP,
    verifyOTP,
    logout,
    sendOTP,
    registerForActivity,
    updateProfile, // Added this function
    signOut: logout, // Alias for logout to match expected interface
  };
};
