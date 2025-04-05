
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const enTranslations: Record<string, string> = {
  "welcome": "Welcome to GUDPALS",
  "dedicated": "DEDICATED TO YOUR HEALTH",
  "complete_profile": "Complete Your Profile",
  "help_personalize": "Help us personalize your experience",
  "get_started": "Get Started",
  "upcoming_sessions": "Upcoming Sessions",
  "our_services": "Our Services",
  "live_sessions": "Live Sessions",
  "join_interactive": "Join interactive live sessions",
  "digital_literacy": "Digital Literacy",
  "learn_smartphone": "Learn smartphone and online skills",
  "activities": "Activities",
  "arts_crafts": "Arts, crafts and social gatherings",
  "employment": "Employment",
  "part_time": "Part-time and flexible opportunities",
  "travel_plans": "Travel Plans",
  "senior_friendly": "Senior-friendly trips and tours",
  "beacon_on": "Beacon is ON",
  "beacon_off": "Beacon is OFF",
  "beacon_active": "Beacon is active. Other GUDPALS users can see you on their map and connect with you.",
  "beacon_inactive": "Beacon is off. Turn it on to find friends and connections around you.",
  "visible": "Visible to others",
  "hidden": "Hidden from others",
  "light_beacon": "Light Your Beacon",
  "you_are_here": "You",
  "home": "Home",
  "sessions": "Sessions",
  "friends": "Friends",
  "products": "Products",
  "profile": "Profile",
  "nearby": "Nearby",
  "connections": "Connections",
  "requests": "Requests",
  "namaste": "नमस्ते!"
};

// Hindi translations
const hiTranslations: Record<string, string> = {
  "welcome": "गुडपाल्स में आपका स्वागत है",
  "dedicated": "आपके स्वास्थ्य के लिए समर्पित",
  "complete_profile": "अपनी प्रोफाइल पूरी करें",
  "help_personalize": "अपने अनुभव को व्यक्तिगत बनाने में मदद करें",
  "get_started": "शुरू करें",
  "upcoming_sessions": "आगामी सत्र",
  "our_services": "हमारी सेवाएं",
  "live_sessions": "लाइव सत्र",
  "join_interactive": "इंटरैक्टिव लाइव सत्रों में शामिल हों",
  "digital_literacy": "डिजिटल साक्षरता",
  "learn_smartphone": "स्मार्टफोन और ऑनलाइन कौशल सीखें",
  "activities": "गतिविधियां",
  "arts_crafts": "कला, शिल्प और सामाजिक सभाएं",
  "employment": "रोजगार",
  "part_time": "अंशकालिक और लचीले अवसर",
  "travel_plans": "यात्रा योजनाएं",
  "senior_friendly": "वरिष्ठ-अनुकूल यात्राएं और पर्यटन",
  "beacon_on": "बीकन चालू है",
  "beacon_off": "बीकन बंद है",
  "beacon_active": "बीकन सक्रिय है। अन्य गुडपाल्स उपयोगकर्ता आपको अपने मानचित्र पर देख सकते हैं और आपसे जुड़ सकते हैं।",
  "beacon_inactive": "बीकन बंद है। अपने आसपास के दोस्तों और संपर्कों को खोजने के लिए इसे चालू करें।",
  "visible": "दूसरों को दिखाई दे रहा है",
  "hidden": "दूसरों से छिपा हुआ है",
  "light_beacon": "अपना बीकन जलाएं",
  "you_are_here": "आप",
  "home": "होम",
  "sessions": "सत्र",
  "friends": "मित्र",
  "products": "उत्पाद",
  "profile": "प्रोफाइल",
  "nearby": "आस-पास",
  "connections": "कनेक्शन्स",
  "requests": "अनुरोध",
  "namaste": "नमस्ते!"
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translations = language === "en" ? enTranslations : hiTranslations;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
