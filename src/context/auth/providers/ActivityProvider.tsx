
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { activityService } from "@/services/activityService";
import { ActivityType } from "../types";
import { useAuthState } from "./AuthStateProvider";
import { useActivityMethods } from "../auth-methods/activityMethods";

interface ActivityProviderProps {
  children: React.ReactNode;
}

interface ActivityContextType {
  registerForActivity: (activityType: ActivityType, activityName: string, redirectPath: string) => void;
}

export const ActivityContext = React.createContext<ActivityContextType>({
  registerForActivity: () => {},
});

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const toastHook = useToast();
  const { registerForActivity: navigateToRegistration } = useActivityMethods(navigate);

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
      navigateToRegistration(activityType, activityName, redirectPath);
    }
  };

  return (
    <ActivityContext.Provider value={{ registerForActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => React.useContext(ActivityContext);
