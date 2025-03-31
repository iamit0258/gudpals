
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Book, GamepadIcon, User } from "lucide-react";
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
    { name: "Learn", path: "/learn", icon: Book },
    { name: "Games", path: "/games", icon: GamepadIcon },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <header className="py-4 px-4 flex items-center justify-between bg-white border-b">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-dhayan-purple-dark">
            <span className="text-dhayan-purple">ग्</span> GUDPALS
          </h1>
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
                        ? "text-dhayan-purple font-medium"
                        : "text-dhayan-gray hover:text-dhayan-purple-dark"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className={cn("h-6 w-6", isActive ? "text-dhayan-purple" : "text-dhayan-gray")} />
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
