
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Book, ShoppingBag, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  hideNavigation = false 
}) => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Sessions", path: "/sessions", icon: Calendar },
    { name: "Friends", path: "/learn", icon: Users },
    { name: "Products", path: "/games", icon: ShoppingBag },
    { name: "Profile", path: "/profile", icon: Users },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <header className="py-3 px-4 flex items-center justify-between bg-white border-b">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/adc8237f-5b88-421f-9ac5-6c272ec9eddc.png" 
            alt="GUDPALS Logo" 
            className="h-10"
          />
        </Link>
      </header>

      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>

      {!hideNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
          <ul className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-lg transition-colors",
                      isActive
                        ? "text-gudpals-green font-medium"
                        : "text-gudpals-gray hover:text-gudpals-green-dark"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className={cn("h-6 w-6", isActive ? "text-gudpals-green" : "text-gudpals-gray")} />
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
