
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/language/LanguageContext";

const WelcomeBanner = () => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <div 
        className="h-64 bg-gradient-to-br from-teal-400 to-primary flex items-center justify-center relative overflow-hidden" 
        style={{
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px"
        }}
      >
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10"></div>
          <div className="absolute left-16 top-32 w-32 h-32 rounded-full bg-white/5"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/10"></div>
        </div>

        <div className="text-center text-white p-4 z-10">
          <div className="flex justify-center mb-4">
            <img 
              alt="GUDPALS Logo" 
              className="h-28 drop-shadow-lg" 
              src="/lovable-uploads/e225dd9d-c4f8-499f-b935-63c2242bbf2d.png" 
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("namaste")}</h1>
          <p className="text-lg font-medium">{t("welcome")}</p>
          <p className="text-sm text-white opacity-90 mt-1 font-light tracking-wider">
            {t("dedicated")}
          </p>
        </div>
      </div>

      <Card className="mx-4 -mt-8 z-10 relative animate-float shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{t("complete_profile")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("help_personalize")}
              </p>
            </div>
            <Button className="bg-primary hover:bg-dhayan-teal-dark text-white rounded-full">
              {t("get_started")} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeBanner;
