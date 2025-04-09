
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t("logged_out"),
        description: t("logout_success")
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // User profile data from Clerk or fallback to demo
  const profileData = {
    firstName: user?.firstName || "Demo",
    lastName: user?.lastName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "demo@example.com",
    phone: user?.primaryPhoneNumber?.phoneNumber || "+1 (555) 123-4567",
    dob: "January 1, 1965" // Clerk doesn't store DOB directly
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">{t("my_profile")}</h1>
        
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-dhayan-purple-light rounded-full flex items-center justify-center mb-4">
                {user?.imageUrl ? (
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.imageUrl} alt={`${profileData.firstName}'s profile`} />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-dhayan-purple" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-12 w-12 text-dhayan-purple" />
                )}
              </div>
              <h2 className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-sm text-dhayan-gray">{user ? "Verified User" : "Demo User"}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-dhayan-gray mr-3" />
                <div>
                  <p className="text-sm text-dhayan-gray">Email</p>
                  <p>{profileData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-dhayan-gray mr-3" />
                <div>
                  <p className="text-sm text-dhayan-gray">Phone</p>
                  <p>{profileData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-dhayan-gray mr-3" />
                <div>
                  <p className="text-sm text-dhayan-gray">Date of Birth</p>
                  <p>{profileData.dob}</p>
                </div>
              </div>
            </div>
          </CardContent>
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
