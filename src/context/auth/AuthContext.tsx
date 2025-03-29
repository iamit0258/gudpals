
import React, { createContext, useContext } from "react";
import { AuthContextType } from "./types";

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  sendOTP: async () => {},
  verifyOTP: async () => {},
  signOut: () => {},
  updateProfile: async () => {},
  isAuthenticated: false,
  registerForActivity: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
