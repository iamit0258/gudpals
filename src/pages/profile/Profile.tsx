
import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Calendar, Award, Heart } from "lucide-react";
import { useAuth } from "@/context/auth";

const Profile = () => {
  const { user, signOut } = useAuth();
  
  if (!user) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-xl font-semibold text-center mb-4">Please sign in to view your profile</h2>
          <Button
            className="bg-dhayan-purple hover:bg-dhayan-purple-dark text-white w-full max-w-xs"
            onClick={() => window.location.href = "/login"}
          >
            Sign In
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const menuItems = [
    { icon: Calendar, label: "My Sessions", link: "/sessions" },
    { icon: Heart, label: "Health & Wellness", link: "/wellness" },
    { icon: Award, label: "Rewards & Points", link: "/rewards" },
    { icon: Settings, label: "Settings", link: "/settings" },
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-dhayan-purple text-white text-xl">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.displayName || "User"}</h2>
                <p className="text-dhayan-gray">{user.email}</p>
                <p className="text-sm mt-1 text-dhayan-purple">Dhayan Member since 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-0">
            <nav>
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.link} 
                      className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="h-5 w-5 mr-3 text-dhayan-purple" />
                      <span>{item.label}</span>
                    </a>
                    {index < menuItems.length - 1 && <div className="h-[1px] bg-gray-100 mx-4" />}
                  </li>
                ))}
              </ul>
            </nav>
          </CardContent>
        </Card>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center text-red-500 border-red-200 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Profile;
