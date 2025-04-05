
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Users, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/context/language/LanguageContext";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  hideNavigation = false
}) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [{
    name: t("home"),
    path: "/",
    icon: Home
  }, {
    name: t("sessions"),
    path: "/sessions",
    icon: Calendar
  }, {
    name: t("friends"),
    path: "/friends",
    icon: Users
  }, {
    name: t("products"),
    path: "/products",
    icon: Package
  }, {
    name: t("profile"),
    path: "/profile",
    icon: User
  }];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher minimal={true} />
      </div>
      
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>

      {!hideNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto shadow-lg">
          <ul className="flex justify-around items-center h-16">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex flex-col items-center p-2 rounded-lg transition-colors",
                      isActive 
                        ? "text-primary font-medium" 
                        : "text-gray-500 hover:text-primary"
                    )} 
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className={cn(
                      "h-6 w-6", 
                      isActive 
                        ? "text-primary" 
                        : "text-gray-500"
                    )} />
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MobileLayout;
