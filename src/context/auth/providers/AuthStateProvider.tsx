
import React, { useState, useEffect } from "react";
import { User } from "../types";

interface AuthStateProviderProps {
  children: React.ReactNode;
}

export interface AuthStateContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
}

export const AuthStateContext = React.createContext<AuthStateContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  setIsLoading: () => {},
  isAuthenticated: false,
});

export const AuthStateProvider: React.FC<AuthStateProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <AuthStateContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => React.useContext(AuthStateContext);
