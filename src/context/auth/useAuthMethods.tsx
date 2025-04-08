
import { User } from "./types";
import { ToastInterface } from "./types/toast";
import { usePhoneAuth } from "./auth-methods/authMethods";
import { useProfileMethods } from "./auth-methods/profileMethods";
import { useSessionMethods } from "./auth-methods/sessionMethods";
import { useActivityMethods } from "./auth-methods/activityMethods";

export const useAuthMethods = () => {
  // Phone authentication methods
  const { loading: phoneAuthLoading, loginWithPhoneOTP, verifyOTP } = usePhoneAuth();
  
  // Profile methods
  const { loading: profileLoading, updateProfile } = useProfileMethods();
  
  // Session methods
  const { loading: sessionLoading, logout, signOut } = useSessionMethods();
  
  // Activity methods
  const { registerForActivity } = useActivityMethods();
  
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
