import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import { ToastInterface, createToastHelper } from "../types/toast";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "../providers/AuthStateProvider";

export const usePhoneAuth = () => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthState();
  const navigate = useNavigate();
  const toastInterface = useToast();

  // Helper function to safely use toast
  const showToast = createToastHelper(toastInterface);

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
            // Demo: in a real app, this would be a Supabase query
            console.log("Registering user for activity:", parsedData.activityName);

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

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      setLoading(true);
      console.log("Logging in directly with phone:", phoneNumber);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const userId = `user_${Date.now()}`;
      const user = {
        uid: userId,
        phoneNumber,
        displayName: null,
        isAnonymous: false,
      };

      if (setUser) {
        setUser(user);
      }

      return { user };
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loginWithPhoneOTP,
    verifyOTP,
    loginWithPhone,
  };
};
