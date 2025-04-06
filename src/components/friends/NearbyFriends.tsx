
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/context/language/LanguageContext";

interface ConcentricCirclesProps {
  isActive: boolean;
  nearbyUsers?: Array<{
    id: number;
    name: string;
    distance: number; // distance in km or meters
    position: { x: number; y: number }; // position in the circle (0-100%)
    image?: string;
  }>;
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({ isActive, nearbyUsers = [] }) => {
  const { t } = useLanguage();
  
  // Mock users for demonstration if no users are provided
  const demoUsers = [
    { 
      id: 1, 
      name: "Raj Kapoor", 
      distance: 0.5, 
      position: { x: 60, y: 35 }, 
      image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=100&auto=format&fit=crop" 
    },
    { 
      id: 2, 
      name: "Parvati Sharma", 
      distance: 1.8, 
      position: { x: 30, y: 70 }, 
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" 
    },
    { 
      id: 3, 
      name: "Mohan Singh", 
      distance: 3.2, 
      position: { x: 75, y: 65 }, 
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&auto=format&fit=crop" 
    },
  ];

  const usersToShow = nearbyUsers.length > 0 ? nearbyUsers : demoUsers;

  return (
    <div className={`relative h-[380px] w-full mt-8 ${isActive ? "opacity-100" : "opacity-40"}`}>
      {/* Outer circle (largest) */}
      <div className="absolute inset-0 border-2 border-dashed border-dhayan-teal/30 rounded-full"></div>
      
      {/* Middle circle */}
      <div className="absolute inset-[50px] border-none bg-dhayan-teal/5 rounded-full"></div>
      
      {/* Inner circle */}
      <div className="absolute inset-[100px] border-none bg-dhayan-teal/10 rounded-full"></div>
      
      {/* Center circle */}
      <div className="absolute inset-[150px] border-none bg-dhayan-teal/20 rounded-full"></div>
      
      {/* You are here icon in the center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-primary shadow-lg flex items-center justify-center">
        <span className="text-white text-xs font-medium">{t("you_are_here")}</span>
      </div>

      {/* Render users only if the beacon is active */}
      {isActive && usersToShow.map((user) => (
        <div
          key={user.id}
          className="absolute h-10 w-10 rounded-full bg-white shadow-md transform -translate-x-1/2 -translate-y-1/2 border-2 border-dhayan-teal"
          style={{ 
            left: `${user.position.x}%`, 
            top: `${user.position.y}%`,
          }}
        >
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dhayan-teal-light text-dhayan-teal font-bold">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white rounded-full px-2 py-0.5 shadow-sm">
            {user.distance < 1 ? `${(user.distance * 1000).toFixed(0)}m` : `${user.distance.toFixed(1)}km`}
          </div>
        </div>
      ))}
    </div>
  );
};

interface NearbyFriendsProps {
  isActive?: boolean;
}

const NearbyFriends: React.FC<NearbyFriendsProps> = ({ isActive: initialIsActive = false }) => {
  const [beaconActive, setBeaconActive] = useState(initialIsActive);
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center py-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">{t("light_beacon")}</h2>
      
      {/* Toggle switch with styling */}
      <div className={`flex items-center justify-center py-3 px-6 rounded-full transition-colors ${
        beaconActive 
          ? "bg-gradient-to-r from-teal-400 to-primary" 
          : "bg-gray-400"
      }`}>
        {beaconActive ? (
          <Wifi className="mr-2 text-white" size={20} />
        ) : (
          <WifiOff className="mr-2 text-white" size={20} />
        )}
        <span className="text-white font-medium">
          {beaconActive ? t("beacon_on") : t("beacon_off")}
        </span>
      </div>
      
      <div className="mt-3 mb-8 text-center max-w-xs text-sm text-dhayan-gray-dark">
        {beaconActive 
          ? t("beacon_active")
          : t("beacon_inactive")}
      </div>
      
      <div className="flex items-center justify-center my-4">
        <Switch 
          checked={beaconActive} 
          onCheckedChange={setBeaconActive}
          className="data-[state=checked]:bg-primary"
        />
        <span className="ml-2 font-medium">
          {beaconActive ? t("visible") : t("hidden")}
        </span>
      </div>
      
      <ConcentricCircles isActive={beaconActive} />
    </div>
  );
};

export default NearbyFriends;
