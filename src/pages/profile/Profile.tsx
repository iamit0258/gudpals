import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Package, ChevronRight, User, Type, Eye, Globe, ShoppingBag, CreditCard, MapPin, Bell, Shield, HelpCircle, Info, MessageSquare, Settings } from "lucide-react";
import { useAuth } from "@/context/ClerkAuthBridge";
import { useLanguage } from "@/context/language/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { user, signOut, updateProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [astrologyChats, setAstrologyChats] = useState<any>({});
  
  // Settings state
  const [textSize, setTextSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    sessions: true,
    marketing: false
  });
  
  // User profile state
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState('Retired teacher who loves gardening and meeting new people');
  const [interestTags, setInterestTags] = useState(['gardening', 'reading', 'travel']);
  const [newInterest, setNewInterest] = useState('');
  
  // Load data from localStorage
  useEffect(() => {
    // Load order history
    const storedOrders = localStorage.getItem('orderHistory');
    if (storedOrders) {
      setOrderHistory(JSON.parse(storedOrders));
    }
    
    // Load astrology chats
    const storedChats = localStorage.getItem('astrologyChats');
    if (storedChats) {
      setAstrologyChats(JSON.parse(storedChats));
    }
    
    // Load profile data
    const storedProfile = localStorage.getItem('profileData');
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setBio(profileData.bio || bio);
      setInterestTags(profileData.interests || interestTags);
    }
  }, []);
  
  if (!user) {
    return (
      <MobileLayout>
        <div className="p-4 flex flex-col items-center justify-center h-[80vh]">
          <h2 className="text-xl font-semibold text-center mb-4">{t("please_sign_in")}</h2>
          <Button
            className="bg-dhayan-purple hover:bg-dhayan-purple-dark text-white w-full max-w-xs"
            onClick={() => navigate("/sign-in")}
          >
            {t("sign_in")}
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const handleEditProfile = () => {
    setDisplayName(user?.displayName || "");
    setShowEditDialog(true);
  };
  
  const handleSaveProfile = async () => {
    try {
      await updateProfile({ displayName });
      
      // Save other profile info to localStorage for demo
      const profileData = {
        bio,
        interests: interestTags
      };
      localStorage.setItem('profileData', JSON.stringify(profileData));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddInterest = () => {
    if (newInterest.trim() && !interestTags.includes(newInterest.trim().toLowerCase())) {
      setInterestTags([...interestTags, newInterest.trim().toLowerCase()]);
      setNewInterest('');
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    setInterestTags(interestTags.filter(tag => tag !== interest));
  };

  const handleTextSizeChange = () => {
    const sizes = ["small", "medium", "large"];
    const currentIndex = sizes.indexOf(textSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    setTextSize(nextSize);
    
    // Apply text size to document
    document.documentElement.style.fontSize = 
      nextSize === "small" ? "14px" : 
      nextSize === "large" ? "18px" : "16px";
    
    toast({
      title: "Text Size Changed",
      description: `Text size set to ${nextSize}`
    });
  };

  const handleHighContrastToggle = () => {
    setHighContrast(!highContrast);
    
    // Apply high contrast theme
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    toast({
      title: "High Contrast",
      description: `High contrast ${!highContrast ? 'enabled' : 'disabled'}`
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
      title: "My Orders",
      description: "Viewing your order history"
    });
  };

  const handlePaymentMethods = () => {
    navigate('/profile/payment-methods');
    toast({
      title: "Payment Methods",
      description: "Opening payment methods (Demo)"
    });
  };

  const handleShippingAddresses = () => {
    navigate('/profile/addresses');
    toast({
      title: "Shipping Addresses",
      description: "Opening addresses (Demo)"
    });
  };

  const handleNotifications = () => {
    toast({
      title: "Notification Settings",
      description: "Updated notification preferences"
    });
  };

  const handlePrivacySecurity = () => {
    toast({
      title: "Privacy & Security",
      description: "Opening privacy settings (Demo)"
    });
  };

  const handleHelpSupport = () => {
    toast({
      title: "Help & Support",
      description: "Opening support center (Demo)"
    });
  };

  const handleAbout = () => {
    toast({
      title: "About Dhayan",
      description: "Version 1.0.0 - Built with ❤️ for seniors"
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
      navigate("/sign-in");
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
  
  const handleAstrologyChatView = (astrologerId: string) => {
    // Store the selected astrologer in localStorage before navigating
    const astrologers = [
      { id: "1", name: "Ravi Sharma", specialty: "Vedic Astrology", initials: "RS" },
      { id: "2", name: "Priya Patel", specialty: "Tarot Reading", initials: "PP" },
      { id: "3", name: "Anand Joshi", specialty: "Palmistry", initials: "AJ" },
      { id: "4", name: "Lakshmi Devi", specialty: "Numerology", initials: "LD" },
      { id: "5", name: "Rajesh Kumar", specialty: "Kundali Matching", initials: "RK" }
    ];
    
    const astrologer = astrologers.find(a => a.id === astrologerId);
    if (astrologer) {
      localStorage.setItem("selectedAstrologer", JSON.stringify(astrologer));
      navigate("/astrology/chat");
    }
  };

  const profileActions = [
    {
      section: "Accessibility",
      items: [
        { 
          icon: Type, 
          label: `Text Size (${textSize})`, 
          onClick: handleTextSizeChange,
          hasToggle: false
        },
        { 
          icon: Eye, 
          label: "High Contrast", 
          onClick: handleHighContrastToggle,
          hasToggle: true,
          isToggled: highContrast
        },
        { 
          icon: Globe, 
          label: `Language (${language === "en" ? "English" : "हिंदी"})`, 
          onClick: handleLanguageChange,
          hasToggle: false
        },
      ]
    },
    {
      section: "Account Settings",
      items: [
        { icon: ShoppingBag, label: "My Orders", onClick: handleMyOrders },
        { icon: CreditCard, label: "Payment Methods", onClick: handlePaymentMethods },
        { icon: MapPin, label: "Shipping Addresses", onClick: handleShippingAddresses },
        { 
          icon: Bell, 
          label: "Notifications", 
          onClick: handleNotifications,
          hasToggle: true,
          isToggled: notifications.orders
        },
        { icon: Shield, label: "Privacy & Security", onClick: handlePrivacySecurity },
        { icon: HelpCircle, label: "Help & Support", onClick: handleHelpSupport },
        { icon: Info, label: "About", onClick: handleAbout },
      ]
    }
  ];
  
  // Get astrologer data from astrology ID
  const getAstrologerName = (id: string) => {
    const astrologers = [
      { id: "1", name: "Ravi Sharma" },
      { id: "2", name: "Priya Patel" },
      { id: "3", name: "Anand Joshi" },
      { id: "4", name: "Lakshmi Devi" },
      { id: "5", name: "Rajesh Kumar" }
    ];
    
    const astrologer = astrologers.find(a => a.id === id);
    return astrologer ? astrologer.name : "Unknown Astrologer";
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        
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
                <p className="text-gray-600">{user.email || user.phoneNumber || "No contact info"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={handleEditProfile}
                  >
                    <User className="h-3 w-3 mr-1" />
                    Edit Profile
                  </Button>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-600">{bio}</p>
            
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Interests
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
        
        {/* Astrology Consultations Section */}
        {Object.keys(astrologyChats).length > 0 && (
          <div className="space-y-1">
            <h2 className="text-lg font-semibold px-1 py-2 bg-gray-50">My Astrology Consultations</h2>
            <Card>
              <CardContent className="p-4">
                {Object.keys(astrologyChats).map((astrologerId) => (
                  <Collapsible key={astrologerId} className="mb-3 border rounded-lg p-2">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold mr-3">
                          {getAstrologerName(astrologerId).substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-medium">{getAstrologerName(astrologerId)}</h3>
                          <p className="text-xs text-gray-500">
                            {astrologyChats[astrologerId].length} messages
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 p-2">
                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50 mb-3">
                          {astrologyChats[astrologerId].slice(0, 2).map((msg: any, idx: number) => (
                            <div key={idx} className="mb-2 text-sm">
                              <span className="font-semibold">{msg.sender === 'user' ? 'You' : getAstrologerName(astrologerId)}:</span> {msg.text}
                            </div>
                          ))}
                          {astrologyChats[astrologerId].length > 2 && (
                            <div className="text-sm text-gray-500">And {astrologyChats[astrologerId].length - 2} more messages...</div>
                          )}
                        </div>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleAstrologyChatView(astrologerId)}
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Continue Conversation
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
        
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
                          <div className="flex items-center">
                            {item.hasToggle && (
                              <Switch 
                                checked={item.isToggled || false}
                                onCheckedChange={() => item.onClick()}
                                className="mr-2"
                              />
                            )}
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
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

      {/* Logout Confirmation Dialog */}
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
      
      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Interests</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {interestTags.map((tag, index) => (
                  <div key={index} className="bg-blue-50 text-blue-600 text-xs rounded-md px-2 py-1 flex items-center">
                    {tag}
                    <button 
                      className="ml-1 text-blue-400 hover:text-blue-600"
                      onClick={() => handleRemoveInterest(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={newInterest} 
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add interest"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                />
                <Button type="button" size="sm" onClick={handleAddInterest}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Profile;
