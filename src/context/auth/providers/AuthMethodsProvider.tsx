
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "./AuthStateProvider";
import { ToastInterface } from "../types/toast";
import { useAuthMethods } from "../useAuthMethods";

interface AuthMethodsProviderProps {
  children: React.ReactNode;
}

interface AuthMethodsContextType {
  sendOTP: (phoneNumber: string) => Promise<any>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
}

export const AuthMethodsContext = React.createContext<AuthMethodsContextType>({
  sendOTP: async () => {},
  verifyOTP: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export const AuthMethodsProvider: React.FC<AuthMethodsProviderProps> = ({ children }) => {
  const { user, setUser } = useAuthState();
  const navigate = useNavigate();
  const toastHook = useToast();

  // Create a properly typed toast interface to pass to the auth methods
  const toastInterface: ToastInterface = {
    toast: (props) => toastHook.toast(props),
    dismiss: toastHook.dismiss,
    toasts: toastHook.toasts
  };

  // Import authentication methods from separate file
  const { sendOTP, verifyOTP, signOut, updateProfile } = useAuthMethods(
    user,
    setUser,
    toastInterface,
    navigate
  );

  return (
    <AuthMethodsContext.Provider
      value={{
        sendOTP,
        verifyOTP,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthMethodsContext.Provider>
  );
};

export const useAuthMethods = () => React.useContext(AuthMethodsContext);
