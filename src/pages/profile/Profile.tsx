
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile, useUser, useClerk } from "@clerk/clerk-react";
import { useLanguage } from "@/context/language/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!isLoaded) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center h-[80vh]">
          <div className="w-16 h-16 border-4 border-t-dhayan-purple border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-dhayan-gray">Loading...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-xl font-semibold text-center mb-4">{t("please_sign_in")}</h2>
          <Button
            className="bg-dhayan-purple hover:bg-dhayan-purple-dark text-white w-full max-w-xs"
            onClick={() => navigate("/login")}
          >
            {t("sign_in")}
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t("logged_out"),
        description: t("logout_success")
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t("logout_error"),
        description: t("logout_failed"),
        variant: "destructive"
      });
    }
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">{t("my_profile")}</h1>
        
        <Card className="overflow-hidden">
          <UserProfile />
        </Card>
        
        <Button 
          variant="outline" 
          className="w-full mt-6 text-red-500 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          {t("logout")}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Profile;
