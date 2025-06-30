
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

      // Check if user profile already exists
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error("Error checking existing profile:", selectError);
        throw selectError;
      }

      const profileData = {
        id: user.id,
        display_name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress || 'User',
        email: user.emailAddresses?.[0]?.emailAddress || null,
        phone_number: user.phoneNumbers?.[0]?.phoneNumber || null,
        photo_url: user.imageUrl || null,
        last_login_at: new Date().toISOString(),
      };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: profileData.display_name,
            email: profileData.email,
            phone_number: profileData.phone_number,
            photo_url: profileData.photo_url,
            last_login_at: profileData.last_login_at,
          })
          .eq('id', user.id);

        if (error) {
          console.error("Error updating user profile:", error);
          throw error;
        }

        console.log("User profile updated successfully");
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert(profileData);

        if (error) {
          console.error("Error creating user profile:", error);
          throw error;
        }

        console.log("User profile created successfully");
        
        toast({
          title: "Welcome!",
          description: "Your profile has been set up successfully",
        });
      }
    } catch (error) {
      console.error("Error syncing user to database:", error);
      // Only show toast for non-table related errors
      if (!error.message?.includes('relation "profiles" does not exist')) {
        toast({
          title: "Sync Error",
          description: "There was an issue syncing your profile data",
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
