
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Package, ChevronRight, Pencil, Type, Eye, Globe, ShoppingBag, CreditCard, MapPin, Bell, Shield, HelpCircle, Info } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useLanguage } from "@/context/language/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [interestTags, setInterestTags] = useState(['gardening', 'reading', 'travel']);
  const [bio, setBio] = useState('Retired teacher who loves gardening and meeting new people');
  
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

  const handleEditProfile = () => {
    toast({
      title: language === "en" ? "Edit Profile" : "प्रोफ़ाइल संपादित करें",
      description: language === "en" ? "Profile edit coming soon" : "प्रोफ़ाइल संपादन जल्द आ रहा है"
    });
  };

  const handleTextSizeChange = () => {
    toast({
      title: language === "en" ? "Text Size" : "पाठ का आकार",
      description: language === "en" ? "Text size adjustment coming soon" : "पाठ के आकार का समायोजन जल्द आ रहा है"
    });
  };

  const handleHighContrastToggle = () => {
    toast({
      title: language === "en" ? "High Contrast" : "उच्च कंट्रास्ट",
      description: language === "en" ? "High contrast mode coming soon" : "उच्च कंट्रास्ट मोड जल्द आ रहा है"
    });
  };

  const handleLanguageChange = () => {
    const newLanguage = language === "en" ? "hi" : "en";
    setLanguage(newLanguage);
    toast({
      title: newLanguage === "en" ? "Language Changed" : "भाषा बदल गई",
      description: newLanguage === "en" ? "Language set to English" : "भाषा हिंदी में सेट की गई"
    });
  };

  const handleMyOrders = () => {
    navigate('/checkout');
    toast({
      title: language === "en" ? "My Orders" : "मेरे आदेश",
      description: language === "en" ? "Viewing your orders" : "आपके आदेश देखना"
    });
  };

  const handlePaymentMethods = () => {
    toast({
      title: language === "en" ? "Payment Methods" : "भुगतान के तरीके",
      description: language === "en" ? "Payment methods coming soon" : "भुगतान के तरीके जल्द आ रहे हैं"
    });
  };

  const handleShippingAddresses = () => {
    toast({
      title: language === "en" ? "Shipping Addresses" : "शिपिंग पते",
      description: language === "en" ? "Shipping addresses coming soon" : "शिपिंग पते जल्द आ रहे हैं"
    });
  };

  const handleNotifications = () => {
    toast({
      title: language === "en" ? "Notifications" : "सूचनाएं",
      description: language === "en" ? "Notification settings coming soon" : "सूचना सेटिंग्स जल्द आ रही हैं"
    });
  };

  const handlePrivacySecurity = () => {
    toast({
      title: language === "en" ? "Privacy & Security" : "गोपनीयता और सुरक्षा",
      description: language === "en" ? "Privacy settings coming soon" : "गोपनीयता सेटिंग्स जल्द आ रही हैं"
    });
  };

  const handleHelpSupport = () => {
    toast({
      title: language === "en" ? "Help & Support" : "सहायता और समर्थन",
      description: language === "en" ? "Support resources coming soon" : "समर्थन संसाधन जल्द आ रहे हैं"
    });
  };

  const handleAbout = () => {
    toast({
      title: language === "en" ? "About" : "के बारे में",
      description: language === "en" ? "App information coming soon" : "ऐप जानकारी जल्द आ रही है"
    });
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    await signOut();
    toast({
      title: language === "en" ? "Logged Out" : "लॉग आउट",
      description: language === "en" ? "You have been logged out successfully" : "आप सफलतापूर्वक लॉग आउट हो गए हैं"
    });
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const profileActions = [
    {
      section: language === "en" ? "Accessibility" : "पहुंच",
      items: [
        { icon: Type, label: language === "en" ? "Text Size" : "पाठ का आकार", onClick: handleTextSizeChange },
        { icon: Eye, label: language === "en" ? "High Contrast" : "उच्च कंट्रास्ट", onClick: handleHighContrastToggle },
        { icon: Globe, label: language === "en" ? "Language" : "भाषा", onClick: handleLanguageChange },
      ]
    },
    {
      section: language === "en" ? "Settings" : "सेटिंग्स",
      items: [
        { icon: ShoppingBag, label: language === "en" ? "My Orders" : "मेरे आदेश", onClick: handleMyOrders },
        { icon: CreditCard, label: language === "en" ? "Payment Methods" : "भुगतान विधियां", onClick: handlePaymentMethods },
        { icon: MapPin, label: language === "en" ? "Shipping Addresses" : "शिपिंग पते", onClick: handleShippingAddresses },
        { icon: Bell, label: language === "en" ? "Notifications" : "सूचनाएं", onClick: handleNotifications },
        { icon: Shield, label: language === "en" ? "Privacy & Security" : "गोपनीयता और सुरक्षा", onClick: handlePrivacySecurity },
        { icon: HelpCircle, label: language === "en" ? "Help & Support" : "सहायता और समर्थन", onClick: handleHelpSupport },
        { icon: Info, label: language === "en" ? "About" : "के बारे में", onClick: handleAbout },
      ]
    }
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">{language === "en" ? "My Profile" : "मेरी प्रोफाइल"}</h1>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start">
              <Avatar className="h-16 w-16 mr-4 bg-emerald-600">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="text-white text-xl">
                  {user.displayName ? user.displayName[0].toUpperCase() : "JS"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.displayName || "Jane Smith"}</h2>
                <p className="text-dhayan-gray">{user.email || "Mumbai, MH"}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-xs"
                  onClick={handleEditProfile}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  {language === "en" ? "Edit Profile" : "प्रोफ़ाइल संपादित करें"}
                </Button>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-600">{bio}</p>
            
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {language === "en" ? "Interests" : "रुचियां"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {interestTags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {profileActions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            <h2 className="text-lg font-semibold px-1 py-2 bg-gray-50">{section.section}</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <nav>
                  <ul>
                    {section.items.map((item, index) => (
                      <li key={index}>
                        <Button 
                          variant="ghost" 
                          className="w-full flex items-center justify-between p-4 rounded-none h-auto"
                          onClick={item.onClick}
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3 text-gray-500" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Button>
                        {index < section.items.length - 1 && <Separator />}
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-6 flex items-center justify-between text-red-500 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <div className="flex items-center">
            <LogOut className="h-5 w-5 mr-3" />
            <span>{language === "en" ? "Logout" : "लॉगआउट"}</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Confirm Logout" : "लॉगआउट की पुष्टि करें"}</DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Are you sure you want to log out of your account?" 
                : "क्या आप वाकई अपने खाते से लॉग आउट करना चाहते हैं?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLogout}>
              {language === "en" ? "Cancel" : "रद्द करें"}
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              {language === "en" ? "Logout" : "लॉगआउट"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Profile;
