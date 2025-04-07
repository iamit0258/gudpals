
import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { User } from "../types";

export const useSessionMethods = (
  setUser?: React.Dispatch<React.SetStateAction<User | null>>,
  navigate?: NavigateFunction
) => {
  const [loading, setLoading] = useState(false);
  
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
      if (navigate) {
        navigate("/login");
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Error logging out:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    logout,
    signOut: logout, // Alias for logout to match expected interface
  };
};
