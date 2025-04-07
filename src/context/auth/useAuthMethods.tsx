
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "./types";
import { ToastInterface, ToastData } from "./types/toast";
import { usePhoneAuth } from "./auth-methods/authMethods";
import { useProfileMethods } from "./auth-methods/profileMethods";
import { useSessionMethods } from "./auth-methods/sessionMethods";
import { useActivityMethods } from "./auth-methods/activityMethods";

export type { ToastInterface, ToastData };

export const useAuthMethods = (
  currentUser?: User | null,
  setUser?: React.Dispatch<React.SetStateAction<User | null>>,
  toastInterface?: ToastInterface,
  navigate?: ReturnType<typeof useNavigate>
) => {
  const defaultNavigate = useNavigate();
  const nav = navigate || defaultNavigate;
  const toastUtil = toastInterface || useToast();
  
  // Phone authentication methods
  const { loading: phoneAuthLoading, loginWithPhoneOTP, verifyOTP } = usePhoneAuth(
    currentUser,
    setUser,
    toastUtil,
    nav
  );
  
  // Profile methods
  const { loading: profileLoading, updateProfile } = useProfileMethods(
    currentUser,
    setUser,
    toastUtil
  );
  
  // Session methods
  const { loading: sessionLoading, logout, signOut } = useSessionMethods(
    setUser,
    nav
  );
  
  // Activity methods
  const { registerForActivity } = useActivityMethods(nav);
  
  // Determine overall loading state
  const loading = phoneAuthLoading || profileLoading || sessionLoading;
  
  // Define sendOTP as alias for loginWithPhoneOTP
  const sendOTP = loginWithPhoneOTP;
  
  return {
    loading,
    loginWithPhoneOTP,
    verifyOTP,
    logout,
    sendOTP,
    registerForActivity,
    updateProfile,
    signOut, // Alias for logout to match expected interface
  };
};
