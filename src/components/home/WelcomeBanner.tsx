
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const WelcomeBanner = () => {
  return (
    <div className="relative">
      <div
        className="h-48 bg-gradient-to-r from-dhayan-purple to-dhayan-purple-dark"
        style={{
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-3xl font-bold mb-2">नमस्ते!</h1>
            <p className="text-lg mb-4">Welcome to GUDPALS</p>
            <p className="text-sm opacity-90">
              Your companion for a happy and active life
            </p>
          </div>
        </div>
      </div>

      <Card className="mx-4 -mt-6 z-10 relative animate-float">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="font-bold text-lg">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Help us personalize your experience
              </p>
            </div>
            <Button className="bg-dhayan-purple hover:bg-dhayan-purple-dark text-white">
              Get Started <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeBanner;
