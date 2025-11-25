import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ChevronRight, User, Type, Globe, ShoppingBag, CreditCard, MapPin, Bell, Shield, HelpCircle, Info, MessageSquare, Settings } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyOrders from "@/components/profile/MyOrders";
import PaymentMethods from "@/components/profile/PaymentMethods";
import ShippingAddresses from "@/components/profile/ShippingAddresses";
import PrivacySecurity from "@/components/profile/PrivacySecurity";
import About from "@/components/profile/About";

const Profile = () => {
  const { user, signOut, updateProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [astrologyChats, setAstrologyChats] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Settings state
  const [textSize, setTextSize] = useState("medium");
  const [notifications, setNotifications] = useState({
    orders: true,
    sessions: true,
    marketing: false
  });

  // User profile state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState('');
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  // Initialize profile data when user is available
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  // Load data from localStorage
  useEffect(() => {
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
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-dhayan-purple to-dhayan-teal rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Profile</h2>
            <p className="text-gray-600 text-sm">Sign in to access your account and personalize your GUDPALS experience</p>
          </div>
          <Button
            className="bg-dhayan-teal hover:bg-dhayan-teal/90 text-white w-full max-w-xs py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/sign-in")}
          >
            Sign In to Continue
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
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      console.log("Saving profile with displayName:", displayName);

      await updateProfile({ displayName: displayName.trim() });

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
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
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

    document.documentElement.style.fontSize =
      nextSize === "small" ? "14px" :
        nextSize === "large" ? "18px" : "16px";

    toast({
      title: "Text Size Changed",
      description: `Text size set to ${nextSize}`
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

  const handleNotifications = () => {
    toast({
      title: "Notification Settings",
      description: "Updated notification preferences"
    });
  };

  const handleHelpSupport = () => {
    toast({
      title: "Help & Support",
      description: "Opening support center (Demo)"
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

  const accessibilitySettings = [
    {
      icon: Type,
      label: `Text Size (${textSize})`,
      onClick: handleTextSizeChange,
      hasToggle: false
    },
    {
      icon: Globe,
      label: `Language (${language === "en" ? "English" : "हिंदी"})`,
      onClick: handleLanguageChange,
      hasToggle: false
    },
  ];

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Avatar className="h-16 w-16 mr-4 bg-emerald-600">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="text-white text-xl bg-gradient-to-br from-blue-500 to-purple-600">
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

            {/* Accessibility Section */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold px-1 py-2 bg-gray-50">Accessibility</h2>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <nav>
                    <ul>
                      {accessibilitySettings.map((item, index) => (
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
                          {index < accessibilitySettings.length - 1 && <Separator />}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </CardContent>
              </Card>
            </div>

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
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h1 className="text-2xl font-bold">Account Settings</h1>

            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
                <TabsTrigger value="payment" className="text-xs">Payment</TabsTrigger>
                <TabsTrigger value="shipping" className="text-xs">Shipping</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-3 mt-2">
                <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
                <TabsTrigger value="privacy" className="text-xs">Privacy</TabsTrigger>
                <TabsTrigger value="about" className="text-xs">About</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4">
                <MyOrders />
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <PaymentMethods />
              </TabsContent>

              <TabsContent value="shipping" className="mt-4">
                <ShippingAddresses />
              </TabsContent>

              <TabsContent value="notifications" className="mt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h2 className="text-lg font-semibold">Notification Preferences</h2>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Order Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about order status</p>
                      </div>
                      <Switch
                        checked={notifications.orders}
                        onCheckedChange={(value) => setNotifications(prev => ({ ...prev, orders: value }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Session Reminders</Label>
                        <p className="text-sm text-muted-foreground">Reminders for upcoming sessions</p>
                      </div>
                      <Switch
                        checked={notifications.sessions}
                        onCheckedChange={(value) => setNotifications(prev => ({ ...prev, sessions: value }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing</Label>
                        <p className="text-sm text-muted-foreground">Promotional offers and updates</p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(value) => setNotifications(prev => ({ ...prev, marketing: value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-4">
                <PrivacySecurity />
              </TabsContent>

              <TabsContent value="about" className="mt-4">
                <About />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Logout")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to logout?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLogout}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              {t("Logout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog - Enhanced */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
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
                placeholder="Enter your name"
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
                disabled={isUpdating}
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
                      disabled={isUpdating}
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
                  disabled={isUpdating}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddInterest}
                  disabled={isUpdating}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isUpdating}>Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSaveProfile}
              disabled={isUpdating || !displayName.trim()}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Profile;
