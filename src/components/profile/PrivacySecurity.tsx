
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Key, Eye, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PrivacySecurity = () => {
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    profileVisibility: true,
    dataSharing: false,
    marketingEmails: true,
    activityTracking: false
  });
  const { toast } = useToast();

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Setting Updated",
      description: `${setting} has been ${value ? 'enabled' : 'disabled'}`
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change form would open here (Demo)"
    });
  };

  const handleDownloadData = () => {
    toast({
      title: "Data Download",
      description: "Your data export has been requested and will be emailed to you"
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "Account deletion confirmation would open here (Demo)",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch 
              checked={settings.twoFactorAuth}
              onCheckedChange={(value) => handleSettingChange('twoFactorAuth', value)}
            />
          </div>
          
          <Button onClick={handleChangePassword} variant="outline" className="w-full">
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Privacy Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Let others find your profile</p>
            </div>
            <Switch 
              checked={settings.profileVisibility}
              onCheckedChange={(value) => handleSettingChange('profileVisibility', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Sharing</Label>
              <p className="text-sm text-muted-foreground">Share usage data to improve services</p>
            </div>
            <Switch 
              checked={settings.dataSharing}
              onCheckedChange={(value) => handleSettingChange('dataSharing', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive promotional emails</p>
            </div>
            <Switch 
              checked={settings.marketingEmails}
              onCheckedChange={(value) => handleSettingChange('marketingEmails', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activity Tracking</Label>
              <p className="text-sm text-muted-foreground">Track app usage for personalization</p>
            </div>
            <Switch 
              checked={settings.activityTracking}
              onCheckedChange={(value) => handleSettingChange('activityTracking', value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleDownloadData} variant="outline" className="w-full">
            Download My Data
          </Button>
          <Button onClick={handleDeleteAccount} variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySecurity;
