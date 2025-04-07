
import { NavigateFunction } from "react-router-dom";

export const useActivityMethods = (navigate?: NavigateFunction) => {
  const registerForActivity = (
    activityType: string,
    activityName: string,
    redirectPath: string,
    activityId?: string
  ) => {
    // Redirect to registration page with activity details
    if (navigate) {
      navigate("/register", {
        state: {
          activityType,
          activityName,
          activityId,
          from: redirectPath,
        },
      });
    }
  };
  
  return {
    registerForActivity,
  };
};
