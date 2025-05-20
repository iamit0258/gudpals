
import React from "react";
import { AuthStateProvider } from "./providers/AuthStateProvider";
import { AuthMethodsProvider } from "./providers/AuthMethodsProvider";
import { ActivityProvider } from "./providers/ActivityProvider";
import { AuthContext } from "./AuthContext";
import { useAuthState } from "./providers/AuthStateProvider";
import { useAuthMethods as useAuthMethodsHook } from "./providers/AuthMethodsProvider";
import { useActivity } from "./providers/ActivityProvider";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthStateProvider>
      <AuthMethodsProvider>
        <ActivityProvider>
          <AuthConsumer>{children}</AuthConsumer>
        </ActivityProvider>
      </AuthMethodsProvider>
    </AuthStateProvider>
  );
};

// This component consumes all the separate context values and provides them through the main AuthContext
const AuthConsumer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuthState();
  const { sendOTP, verifyOTP, signOut, updateProfile } = useAuthMethodsHook();
  const { registerForActivity } = useActivity();

  // Simple register implementation for demo
  const register = async (data: any) => {
    console.log("Registering user:", data);
    // For demo purposes, return success after a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock success response
    return { 
      error: null, 
      status: "needs_email_verification"
    };
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
        isAuthenticated,
        registerForActivity,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
