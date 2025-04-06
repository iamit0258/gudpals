
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Calendar, Award, Heart, MessageSquare, Package, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { t, language } = useLanguage();
  const [orderHistory, setOrderHistory] = useState([]);
  
  useEffect(() => {
    // Load order history from localStorage
    const storedOrders = localStorage.getItem('orderHistory');
    if (storedOrders) {
      setOrderHistory(JSON.parse(storedOrders));
    }
  }, []);
  
  if (!user) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-xl font-semibold text-center mb-4">Please sign in to view your profile</h2>
          <Button
            className="bg-dhayan-purple hover:bg-dhayan-purple-dark text-white w-full max-w-xs"
            onClick={() => window.location.href = "/login"}
          >
            Sign In
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const menuItems = [
    { icon: Calendar, label: language === "en" ? "My Sessions" : "मेरे सत्र", link: "/sessions" },
    { icon: Heart, label: language === "en" ? "Health & Wellness" : "स्वास्थ्य और कल्याण", link: "/wellness" },
    { icon: Award, label: language === "en" ? "Rewards & Points" : "पुरस्कार और अंक", link: "/rewards" },
    { icon: MessageSquare, label: language === "en" ? "My Messages" : "मेरे संदेश", link: "/messages" },
    { icon: Settings, label: language === "en" ? "Settings" : "सेटिंग्स", link: "/settings" },
  ];

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-dhayan-purple text-white text-xl">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.displayName || "User"}</h2>
                <p className="text-dhayan-gray">{user.email}</p>
                <p className="text-sm mt-1 text-dhayan-purple">GUDPALS Member since 2023</p>
                <Link 
                  to="/settings"
                  className="inline-flex items-center text-xs mt-2 text-dhayan-purple hover:underline"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  {language === "en" ? "Edit Profile" : "प्रोफाइल संपादित करें"}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="menu">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="menu">{language === "en" ? "Menu" : "मेनू"}</TabsTrigger>
            <TabsTrigger value="orders">{language === "en" ? "Order History" : "ऑर्डर इतिहास"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <Card>
              <CardContent className="p-0">
                <nav>
                  <ul>
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link 
                          to={item.link} 
                          className="flex items-center p-4 hover:bg-gray-50 transition-colors justify-between"
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3 text-dhayan-purple" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                        {index < menuItems.length - 1 && <div className="h-[1px] bg-gray-100 mx-4" />}
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              className="w-full mt-6 flex items-center justify-center text-red-500 border-red-200 hover:bg-red-50"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {language === "en" ? "Sign Out" : "साइन आउट"}
            </Button>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "en" ? "Your Orders" : "आपके ऑर्डर"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderHistory.length > 0 ? (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">
                              {language === "en" ? "Order #" : "ऑर्डर #"}{order.id.toString().slice(-6)}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {language === "en" ? order.status : order.status === "Completed" ? "पूरा हुआ" : order.status}
                          </span>
                        </div>
                        
                        {order.items.map((item) => (
                          <div key={item.productId} className="p-4 flex items-center border-t">
                            <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0 mr-3 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                  {language === "en" ? "Qty: " : "मात्रा: "}{item.quantity}
                                </p>
                                <p className="font-semibold">
                                  {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                  }).format(item.price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="p-4 border-t bg-gray-50">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{language === "en" ? "Total:" : "कुल:"}</span>
                            <span className="font-bold text-primary">
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                              }).format(order.total)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 border-t flex justify-between">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Package className="h-3.5 w-3.5 mr-1" />
                            {language === "en" ? "Track Order" : "ऑर्डर ट्रैक करें"}
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            {language === "en" ? "Buy Again" : "फिर से खरीदें"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">
                      {language === "en" 
                        ? "You haven't placed any orders yet" 
                        : "आपने अभी तक कोई ऑर्डर नहीं दिया है"}
                    </p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={() => window.location.href = "/products"}
                    >
                      {language === "en" ? "Browse Products" : "उत्पाद ब्राउज़ करें"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Profile;
