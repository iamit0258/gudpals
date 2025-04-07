
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
            
            toast({
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
      
      // Redirect to login page
      navigate("/login");
      
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
  
  const registerForActivity = (
    activityType: string,
    activityName: string,
    redirectPath: string,
    activityId?: string
  ) => {
    // Redirect to registration page with activity details
    navigate("/register", {
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
  };
};
