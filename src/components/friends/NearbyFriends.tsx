
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Radio, MapPin, MessageCircle, Phone, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { Input } from "@/components/ui/input";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Real nearby friends will come from database/location services
const mockNearbyFriends = [
  {
    id: "1",
    name: "राम कुमार",
    distance: "0.5 km",
    lastSeen: "2 mins ago",
    latitude: 28.6139,
    longitude: 77.2090
  },
  {
    id: "2",
    name: "सुनीता शर्मा",
    distance: "1.2 km",
    lastSeen: "5 mins ago",
    latitude: 28.6129,
    longitude: 77.2095
  },
  {
    id: "3",
    name: "अनिल पटेल",
    distance: "2.4 km",
    lastSeen: "15 mins ago",
    latitude: 28.6149,
    longitude: 77.2085
  }
];

const NearbyFriends = () => {
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [friends, setFriends] = useState(mockNearbyFriends);
  const [showMap, setShowMap] = useState(false);
  const [mapboxToken, setMapboxToken] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Delhi coordinates
          setUserLocation({
            lat: 28.6139,
            lng: 77.2090
          });
        }
      );
    }
  }, []);

  // Initialize map when token is provided and map should be shown
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !showMap || !userLocation) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [userLocation.lng, userLocation.lat],
      zoom: 13
    });

    // Add user's location marker
    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<h3>You are here</h3>'))
      .addTo(map.current);

    // Add nearby friends markers
    friends.forEach(friend => {
      const marker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat([friend.longitude, friend.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h4>${friend.name}</h4>
            <p>Distance: ${friend.distance}</p>
            <p>Last seen: ${friend.lastSeen}</p>
          </div>
        `))
        .addTo(map.current!);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, showMap, userLocation, friends]);

  const toggleBeacon = () => {
    setIsBeaconActive(!isBeaconActive);
    if (!isBeaconActive) {
      toast({
        title: t("beacon_activated"),
        description: t("beacon_activated_desc"),
      });
    } else {
      toast({
        title: t("beacon_deactivated"),
        description: t("beacon_deactivated_desc"),
      });
    }
  };

  const handleMessage = (name: string) => {
    toast({
      title: t("opening_chat"),
      description: `${t("chat_with")} ${name}`,
    });
  };

  const handleCall = (name: string) => {
    toast({
      title: t("calling"),
      description: `${t("calling")} ${name}...`,
    });
  };

  const toggleMapView = () => {
    if (!mapboxToken && !showMap) {
      toast({
        title: "Mapbox Token Required",
        description: "Please enter your Mapbox public token to view the map",
        variant: "destructive"
      });
      return;
    }
    setShowMap(!showMap);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col items-center bg-gradient-to-b from-green-900 to-green-600">
        <h2 className="text-2xl font-bold text-white mb-4">{t("beacon")}</h2>
        
        <Button 
          onClick={toggleBeacon}
          className={`rounded-full mb-4 px-8 py-2 ${
            isBeaconActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-500/60 hover:bg-gray-500/80"
          } transition-all`}
        >
          <Radio className="h-5 w-5 mr-2" />
          {isBeaconActive ? t("beacon_on") : t("beacon_off")}
        </Button>
        
        <p className="text-center text-white/80 mb-4">
          {isBeaconActive 
            ? t("beacon_active_desc")
            : t("beacon_inactive_desc")}
        </p>

        {/* Mapbox Token Input */}
        {!mapboxToken && (
          <div className="w-full max-w-md mb-4">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-white/90 text-black"
            />
            <p className="text-xs text-white/70 mt-1">
              Get your token from https://mapbox.com/
            </p>
          </div>
        )}

        {/* Map Toggle Button */}
        <Button 
          onClick={toggleMapView}
          className="mb-4 bg-white/20 hover:bg-white/30"
          disabled={!mapboxToken}
        >
          <Map className="h-4 w-4 mr-2" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
        
        {/* Map Container */}
        {showMap && (
          <div className="w-full max-w-md h-64 mb-4 rounded-lg overflow-hidden">
            <div ref={mapContainer} className="w-full h-full" />
          </div>
        )}

        {/* Concentric circles visualization */}
        {!showMap && (
          <div className="relative w-64 h-64 mb-6">
            {/* Outer circle (dashed) */}
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-dashed border-green-300/50 animate-pulse"></div>
            
            {/* Animated pulse rings */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 h-5/6 rounded-full bg-green-400/20 ${isBeaconActive ? 'animate-ping opacity-70' : 'opacity-30'}`} style={{ animationDuration: '3s' }}></div>
            
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-green-400/30 ${isBeaconActive ? 'animate-ping opacity-80' : 'opacity-40'}`} style={{ animationDuration: '2.5s' }}></div>
            
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-green-400/40 ${isBeaconActive ? 'animate-ping opacity-90' : 'opacity-50'}`} style={{ animationDuration: '2s' }}></div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-50 shadow-lg flex items-center justify-center z-10">
              <div className={`w-6 h-6 rounded-full ${isBeaconActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Nearby friends section */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold mb-2">{t("nearby_friends")}</h3>
        
        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-primary text-white font-semibold">
                        {getInitials(friend.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{friend.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{friend.distance}</span>
                        <span className="mx-2">•</span>
                        <span>{friend.lastSeen}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleMessage(friend.name)}
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-primary hover:bg-primary/10"
                        onClick={() => handleCall(friend.name)}
                      >
                        <Phone className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>{t("no_nearby_friends")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFriends;
