
import React from "react";
import { useLanguage } from "@/context/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

import { useLocation } from "react-router-dom";

interface LanguageSwitcherProps {
  minimal?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ minimal = false }) => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  // Only show on home page
  if (location.pathname !== "/") {
    return null;
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  if (minimal) {
    return (
      <button
        onClick={toggleLanguage}
        className="text-primary-foreground text-xs font-medium bg-primary/20 backdrop-blur-sm px-2 py-1 rounded-full"
      >
        {language === "en" ? "हिंदी" : "EN"}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="rounded-full gap-2"
    >
      <Globe size={18} />
      {language === "en" ? "हिंदी में देखें" : "View in English"}
    </Button>
  );
};

export default LanguageSwitcher;
