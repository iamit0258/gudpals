
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { activityService } from "@/services/activityService";
import { AuthContext } from "./AuthContext";
import { User, ActivityType } from "./types";
import { useAuthMethods, ToastInterface } from "./useAuthMethods";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toastHook = useToast();
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

  // Auth state changed handler
  useEffect(() => {
    // Update localStorage when user changes
    if (user) {
      localStorage.setItem("dhayan_user", JSON.stringify(user));
    }
  }, [user]);

  // Handle activity registration
  const registerForActivity = (activityType: ActivityType, activityName: string, redirectPath: string) => {
    if (user) {
      // If user is logged in, register them directly
      activityService.registerForActivity(user, activityType, activityName)
        .then(() => {
          toastHook.toast({
            title: "Registration Successful",
            description: `You've been registered for ${activityName}`,
          });
          
          // Navigate to the activity page with registered state
          navigate(redirectPath, { 
            state: { 
              registered: true,
              activityName
            } 
          });
        })
        .catch((error) => {
          console.error("Registration error:", error);
          toastHook.toast({
            title: "Registration Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      // If not logged in, redirect to registration page
      navigate("/register", { 
        state: { 
          from: redirectPath,
          activityType,
          activityName
        } 
      });
    }
  };

  // Create a properly typed toast object to pass to the auth methods
  const toastInterface: ToastInterface = { toast: toastHook };

  // Import authentication methods from separate file
  const { sendOTP, verifyOTP, signOut, updateProfile } = useAuthMethods(
    user,
    setUser,
    toastInterface,
    navigate
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        sendOTP,
        verifyOTP,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
        registerForActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
