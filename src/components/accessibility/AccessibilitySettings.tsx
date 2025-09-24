import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Moon, 
  Sun, 
  Volume2, 
  Bell, 
  Accessibility, 
  Type, 
  Eye, 
  Palette,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessibilitySettingsProps {
  className?: string;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ className }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    darkMode: false,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    soundEnabled: true,
    notificationsEnabled: true,
    voiceAssistantEnabled: true,
    fontSize: [16],
    soundVolume: [80],
    animationSpeed: [100],
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility_settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
    
    // Apply initial settings
    applySettings(settings);
  }, []);

  // Save settings and apply them
  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
    applySettings(newSettings);
    
    toast({
      title: "Settings Updated",
      description: "Your accessibility preferences have been saved.",
    });
  };

  // Apply settings to the DOM
  const applySettings = (newSettings: typeof settings) => {
    const root = document.documentElement;
    
    // Dark mode
    if (newSettings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('motion-safe');
    } else {
      root.classList.remove('motion-safe');
    }
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize[0]}px`;
    
    // Large text class
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      darkMode: false,
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      soundEnabled: true,
      notificationsEnabled: true,
      voiceAssistantEnabled: true,
      fontSize: [16],
      soundVolume: [80],
      animationSpeed: [100],
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(defaultSettings));
    applySettings(defaultSettings);
    
    toast({
      title: "Settings Reset",
      description: "All accessibility settings have been reset to defaults.",
    });
  };

  return (
    <div className={className}>
      <Tabs defaultValue="display" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="interaction" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Interaction
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Visual Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Settings */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark colors to reduce eye strain
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(value) => updateSetting('darkMode', value)}
                    aria-label="Toggle dark mode"
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(value) => updateSetting('highContrast', value)}
                  aria-label="Toggle high contrast"
                />
              </div>

              {/* Font Size */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Font Size</Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust text size for better readability
                  </p>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={settings.fontSize}
                    onValueChange={(value) => updateSetting('fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                    aria-label="Font size"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Small (12px)</span>
                    <span>Current: {settings.fontSize[0]}px</span>
                    <span>Large (24px)</span>
                  </div>
                </div>
              </div>

              {/* Large Text Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Large Text</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply large text styles to buttons and UI elements
                  </p>
                </div>
                <Switch
                  checked={settings.largeText}
                  onCheckedChange={(value) => updateSetting('largeText', value)}
                  aria-label="Toggle large text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sound Volume */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Sound Volume</Label>
                  <p className="text-sm text-muted-foreground">
                    Adjust overall sound volume
                  </p>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={settings.soundVolume}
                    onValueChange={(value) => updateSetting('soundVolume', value)}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                    aria-label="Sound volume"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mute</span>
                    <span>{settings.soundVolume[0]}%</span>
                    <span>Maximum</span>
                  </div>
                </div>
              </div>

              {/* Voice Assistant */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Voice Assistant</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable voice commands and audio feedback
                  </p>
                </div>
                <Switch
                  checked={settings.voiceAssistantEnabled}
                  onCheckedChange={(value) => updateSetting('voiceAssistantEnabled', value)}
                  aria-label="Toggle voice assistant"
                />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for interactions and feedback
                  </p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(value) => updateSetting('soundEnabled', value)}
                  aria-label="Toggle sound effects"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interaction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Interaction Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(value) => updateSetting('reducedMotion', value)}
                  aria-label="Toggle reduced motion"
                />
              </div>

              {/* Animation Speed */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Animation Speed</Label>
                  <p className="text-sm text-muted-foreground">
                    Control how fast animations play
                  </p>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={settings.animationSpeed}
                    onValueChange={(value) => updateSetting('animationSpeed', value)}
                    min={25}
                    max={200}
                    step={25}
                    className="w-full"
                    aria-label="Animation speed"
                    disabled={settings.reducedMotion}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Slow</span>
                    <span>{settings.animationSpeed[0]}%</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates and alerts
                  </p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(value) => updateSetting('notificationsEnabled', value)}
                  aria-label="Toggle notifications"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset Button */}
      <div className="flex justify-end pt-6">
        <Button onClick={resetToDefaults} variant="outline">
          Reset to Defaults
        </Button>
      </div>

      {/* Device Compatibility */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Monitor className="h-3 w-3" />
              Desktop
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Tablet className="h-3 w-3" />
              Tablet
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Smartphone className="h-3 w-3" />
              Mobile
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            These accessibility settings work across all your devices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilitySettings;