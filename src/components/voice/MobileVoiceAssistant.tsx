import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Settings,
  Activity,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useComponentAnalytics } from '@/hooks/useAnalytics';

interface MobileVoiceAssistantProps {
  className?: string;
  isListening: boolean;
  isSpeaking: boolean;
  isEnabled: boolean;
  currentMessage: string;
  micPermission: 'granted' | 'denied' | 'prompt';
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleEnabled: () => void;
  onShowHelp: () => void;
}

const MobileVoiceAssistant: React.FC<MobileVoiceAssistantProps> = ({
  className,
  isListening,
  isSpeaking,
  isEnabled,
  currentMessage,
  micPermission,
  onStartListening,
  onStopListening,
  onToggleEnabled,
  onShowHelp,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { trackClick, trackInteraction } = useComponentAnalytics('MobileVoiceAssistant');

  const handleMainAction = useCallback(() => {
    trackClick('main_button');
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  }, [isListening, onStartListening, onStopListening, trackClick]);

  const handleToggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
    trackInteraction('minimize', 'toggle');
  }, [isMinimized, trackInteraction]);

  if (!isMobile) {
    return null; // Only show on mobile
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-20 right-4 z-50", className)}>
        <Button
          onClick={handleToggleMinimize}
          size="sm"
          className={cn(
            "rounded-full h-12 w-12 shadow-lg transition-all duration-200",
            isListening ? "animate-pulse" : "",
            isEnabled ? "bg-primary hover:bg-primary/90" : "bg-gray-400"
          )}
          disabled={!isEnabled}
          aria-label="Expand voice assistant"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-20 left-4 right-4 z-50", className)}>
      <Card className="backdrop-blur-md bg-white/95 border shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Voice Assistant
            </span>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleToggleMinimize}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Minimize"
              >
                <Activity className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isListening && (
                <Badge variant="default" className="animate-pulse">
                  <Mic className="h-3 w-3 mr-1" />
                  Listening
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="secondary" className="animate-pulse">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Speaking
                </Badge>
              )}
              {!isListening && !isSpeaking && isEnabled && (
                <Badge variant="outline">
                  Ready
                </Badge>
              )}
              {!isEnabled && (
                <Badge variant="destructive">
                  Disabled
                </Badge>
              )}
            </div>
            
            {micPermission === 'denied' && (
              <Badge variant="destructive" className="text-xs">
                Mic Blocked
              </Badge>
            )}
          </div>

          {/* Current Message */}
          {currentMessage && isSpeaking && (
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm text-primary font-medium">
                {currentMessage}
              </p>
            </div>
          )}

          {showSettings && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Voice Assistant</span>
                  <Button
                    onClick={onToggleEnabled}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    {isEnabled ? (
                      <>
                        <Volume2 className="h-3 w-3 mr-1" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-3 w-3 mr-1" />
                        Disabled
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Microphone</span>
                  <Badge 
                    variant={micPermission === 'granted' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {micPermission === 'granted' ? 'Allowed' : 
                     micPermission === 'denied' ? 'Blocked' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onShowHelp}
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={!isEnabled}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            
            <Button
              onClick={handleMainAction}
              disabled={!isEnabled || micPermission === 'denied'}
              size="sm"
              className={cn(
                "flex-2 transition-all duration-200",
                isListening 
                  ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Speak
                </>
              )}
            </Button>
          </div>

          {/* Microphone Permission Warning */}
          {micPermission === 'denied' && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Microphone access required:</strong> Please allow microphone access in your browser settings to use voice commands.
              </p>
            </div>
          )}

          {/* Voice Commands Hint */}
          {!showSettings && isEnabled && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Tap the microphone and say "help" to see available commands
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileVoiceAssistant;