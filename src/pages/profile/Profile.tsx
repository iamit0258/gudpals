
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
          <h2 className="text-xl font-semibold text-center mb-4">{t("please_sign_in")}</h2>
          <Button
            className="bg-dhayan-purple hover:bg-dhayan-purple-dark text-white w-full max-w-xs"
            onClick={() => navigate("/login")}
          >
            {t("sign_in")}
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const handleEditProfile = () => {
    toast({
      title: t("edit_profile"),
      description: t("profile_edit_coming_soon")
    });
  };

  const handleTextSizeChange = () => {
    toast({
      title: t("text_size"),
      description: t("text_size_coming_soon")
    });
  };

  const handleHighContrastToggle = () => {
    toast({
      title: t("high_contrast"),
      description: t("contrast_coming_soon")
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
      title: t("my_orders"),
      description: t("viewing_orders")
    });
  };

  const handlePaymentMethods = () => {
    toast({
      title: t("payment_methods"),
      description: t("payment_coming_soon")
    });
  };

  const handleShippingAddresses = () => {
    toast({
      title: t("shipping_addresses"),
      description: t("shipping_coming_soon")
    });
  };

  const handleNotifications = () => {
    toast({
      title: t("notifications"),
      description: t("notifications_coming_soon")
    });
  };

  const handlePrivacySecurity = () => {
    toast({
      title: t("privacy_security"),
      description: t("privacy_coming_soon")
    });
  };

  const handleHelpSupport = () => {
    toast({
      title: t("help_support"),
      description: t("support_coming_soon")
    });
  };

  const handleAbout = () => {
    toast({
      title: t("about"),
      description: t("app_info_coming_soon")
    });
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    try {
      await signOut();
      toast({
        title: t("logged_out"),
        description: t("logout_success")
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t("logout_error"),
        description: t("logout_failed"),
        variant: "destructive"
      });
    }
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const profileActions = [
    {
      section: t("accessibility"),
      items: [
        { icon: Type, label: t("text_size"), onClick: handleTextSizeChange },
        { icon: Eye, label: t("high_contrast"), onClick: handleHighContrastToggle },
        { icon: Globe, label: t("language"), onClick: handleLanguageChange },
      ]
    },
    {
      section: t("settings"),
      items: [
        { icon: ShoppingBag, label: t("my_orders"), onClick: handleMyOrders },
        { icon: CreditCard, label: t("payment_methods"), onClick: handlePaymentMethods },
        { icon: MapPin, label: t("shipping_addresses"), onClick: handleShippingAddresses },
        { icon: Bell, label: t("notifications"), onClick: handleNotifications },
        { icon: Shield, label: t("privacy_security"), onClick: handlePrivacySecurity },
        { icon: HelpCircle, label: t("help_support"), onClick: handleHelpSupport },
        { icon: Info, label: t("about"), onClick: handleAbout },
      ]
    }
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">{t("my_profile")}</h1>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start">
              <Avatar className="h-16 w-16 mr-4 bg-emerald-600">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="text-white text-xl">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.displayName || "User"}</h2>
                <p className="text-dhayan-gray">{user.email || user.phoneNumber || "No contact info"}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-xs"
                  onClick={handleEditProfile}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  {t("edit_profile")}
                </Button>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-600">{bio}</p>
            
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t("interests")}
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
            <span>{t("logout")}</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirm_logout")}</DialogTitle>
            <DialogDescription>
              {t("confirm_logout_desc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLogout}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              {t("logout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Profile;
