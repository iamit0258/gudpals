import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Globe, Moon, User, Activity, Accessibility } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/ClerkAuthBridge";
import AccessibilitySettings from "@/components/accessibility/AccessibilitySettings";
import PerformanceDashboard from "@/components/performance/PerformanceDashboard";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const Settings = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = React.useState(user?.displayName || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: name,
        email: email
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ErrorBoundary>
      <MobileLayout>
        <div className="p-4 space-y-6">
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-1">
                <Bell className="h-4 w-4" />
                Prefs
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-1">
                <Accessibility className="h-4 w-4" />
                A11y
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Perf
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="focus-ring"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="focus-ring"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={phoneNumber}
                      disabled
                      className="bg-gray-100 focus-ring"
                    />
                    <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
                  </div>
                  
                  <Button 
                    className="w-full focus-ring"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked className="focus-ring" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <Switch id="sms-notifications" className="focus-ring" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive mobile push notifications</p>
                    </div>
                    <Switch id="push-notifications" defaultChecked className="focus-ring" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4 text-primary" />
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <Switch id="dark-mode" className="focus-ring" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <Label htmlFor="language">Language</Label>
                    </div>
                    <select className="rounded border p-1 text-sm focus-ring" defaultValue="en">
                      <option value="en">English</option>
                      <option value="hi">हिंदी</option>
                      <option value="gu">ગુજરાતી</option>
                      <option value="mr">मराठी</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <Label htmlFor="reminders">Daily Reminders</Label>
                    </div>
                    <Switch id="reminders" defaultChecked className="focus-ring" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                    </div>
                    <Switch id="data-sharing" className="focus-ring" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accessibility" className="mt-4">
              <AccessibilitySettings />
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <PerformanceDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </MobileLayout>
    </ErrorBoundary>
  );
};

export default Settings;