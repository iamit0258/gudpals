import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserSync = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const syncUserToDatabase = async () => {
    if (!user || !isLoaded) return;

    try {
      console.log("Syncing user to database:", user.id);

      const profileData = {
        id: user.id, // Now using TEXT format, no conversion needed
        display_name: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress || 'User',
        email: user.emailAddresses?.[0]?.emailAddress || null,
        phone_number: user.phoneNumbers?.[0]?.phoneNumber || null,
        photo_url: user.imageUrl || null,
        last_login_at: new Date().toISOString(),
      };

      // Call the edge function to safely sync the profile using service role key
      const { error } = await supabase.functions.invoke('sync-profile', {
        body: profileData,
      });

      if (error) {
        console.error("Error syncing user profile:", error);
        throw error;
      }

      console.log("User profile synced successfully");
    } catch (error: any) {
      console.error("Error syncing user to database:", error);

      // Only show toast for non-duplicate key errors or if we really want to notify
      // In most cases, we can silently fail or log to monitoring
      if (error?.code !== '23505') { // 23505 is unique_violation
        toast({
          title: "Sync Error",
          description: "There was an issue syncing your profile data. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      syncUserToDatabase();
    }
  }, [user, isLoaded]);

  return { syncUserToDatabase };
};
