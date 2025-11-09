
import { useEffect } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const { toast } = useToast();

  const syncUserToDatabase = async () => {
    if (!user || !isLoaded) return;

    try {
      console.log("Syncing user to database:", user.id);

      const displayName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress || 'User';

      // Call edge function with Clerk token in Authorization header
      const token = await getToken();
      const { data, error } = await supabase.functions.invoke('sync-clerk-profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: {
          userId: user.id,
          displayName,
          email: user.emailAddresses?.[0]?.emailAddress || null,
          phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || null,
          photoUrl: user.imageUrl || null,
        }
      });

      if (error) {
        console.error("Error syncing profile:", error);
        throw error;
      }

      console.log("User profile synced successfully:", data);
      
      if (data.action === 'created') {
        toast({
          title: "Welcome!",
          description: "Your profile has been set up successfully",
        });
      }
    } catch (error: any) {
      console.error("Error syncing user to database:", error);
      
      // Show user-friendly error message
      toast({
        title: "Sync Error",
        description: "There was an issue syncing your profile data. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      syncUserToDatabase();
    }
  }, [user, isLoaded]);

  return { syncUserToDatabase };
};
