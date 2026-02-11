
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

<<<<<<< HEAD
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
=======

  const navItems = [
    {
      name: t("home"),
      path: "/",
      icon: Home
    },
    {
      name: t("sessions"),
      path: "/sessions",
      icon: Calendar
    },
    {
      name: t("friends"),
      path: "/friends",
      icon: Users
    },
    {
      name: t("products"),
      path: "/products",
      icon: Package
    },
    {
      name: t("profile"),
      path: "/profile",
      icon: User
    }
  ];


>>>>>>> my-branch

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Desktop Navigation */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b z-50 items-center">
        <div className="container max-w-6xl mx-auto flex justify-between items-center px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/home-logo.png" alt="Logo" className="h-10" />
            <span className="font-bold text-xl text-primary">GUDPALS</span>
          </Link>

          <ul className="flex items-center gap-8">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 transition-colors font-medium",
                      isActive ? "text-primary border-b-2 border-primary pb-1" : "text-gray-500 hover:text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-4">
            <LanguageSwitcher minimal={true} />
          </div>
        </div>
      </header>

      {/* Mobile Top Bar / Backdrop */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <LanguageSwitcher minimal={true} />
      </div>

      <main className={cn(
        "flex-1 overflow-auto w-full",
        !hideNavigation && "pb-16 md:pb-0 md:pt-20"
      )}>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {!hideNavigation && (
        <nav
          className="fixed bottom-0 left-0 right-0 bg-white border-t mx-auto shadow-lg backdrop-blur-md md:hidden z-50"
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="flex justify-around items-center h-16">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-lg transition-all duration-200 focus-ring",
                      "hover:bg-primary/10 active:scale-95",
                      isActive
                        ? "text-primary font-medium bg-primary/5"
                        : "text-gray-500 hover:text-primary"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className={cn(
                      "h-6 w-6 transition-transform",
                      isActive
                        ? "text-primary scale-110"
                        : "text-gray-500"
                    )} />
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
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
