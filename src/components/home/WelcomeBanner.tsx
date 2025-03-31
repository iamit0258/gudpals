
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
const WelcomeBanner = () => {
  return <div className="relative">
      <div className="h-56 bg-gradient-to-r from-gudpals-green to-gudpals-green-dark flex items-center justify-center" style={{
      borderBottomLeftRadius: "30px",
      borderBottomRightRadius: "30px"
    }}>
        <div className="text-center text-white p-4">
          <div className="flex justify-center mb-4">
            <img alt="GUDPALS Logo" src="/lovable-uploads/adc8237f-5b88-421f-9ac5-6c272ec9eddc.png" className="h-32 object-contain" />
          </div>
          <p className="text-lg">Welcome to GUDPALS</p>
          <p className="text-sm opacity-90 mt-1">
            DEDICATED TO YOUR HEALTH
          </p>
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
            <Button className="bg-gudpals-green hover:bg-gudpals-green-dark text-white">
              Get Started <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default WelcomeBanner;
