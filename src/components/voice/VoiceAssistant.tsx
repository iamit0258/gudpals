
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { voiceAssistantService } from '@/services/voiceAssistantService';
import MobileVoiceAssistant from './MobileVoiceAssistant';

interface VoiceAssistantProps {
  className?: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    initializeVoiceAssistant();
    return cleanup;
  }, []);

  const initializeVoiceAssistant = async () => {
    if (isInitializedRef.current) return;
    
    try {
      // Check microphone permission
      const permissionResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setMicPermission(permissionResult.state);
      
      // Initialize speech synthesis first
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
        
        // Wait for voices to load
        if (synthRef.current.getVoices().length === 0) {
          await new Promise<void>((resolve) => {
            const checkVoices = () => {
              if (synthRef.current && synthRef.current.getVoices().length > 0) {
                resolve();
              } else {
                setTimeout(checkVoices, 100);
              }
            };
            checkVoices();
          });
        }
      }

      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionConstructor();
        
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice command received:', transcript);
          handleVoiceCommand(transcript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          let errorMessage = "Voice recognition had an issue. Please try again.";
          
          switch (event.error) {
            case 'network':
              errorMessage = "Network issue detected. Please check your connection and try again.";
              break;
            case 'not-allowed':
              errorMessage = "Microphone access denied. Please allow microphone access and try again.";
              setMicPermission('denied');
              break;
            case 'no-speech':
              errorMessage = "No speech detected. Please speak clearly and try again.";
              break;
            case 'audio-capture':
              errorMessage = "Microphone not available. Please check your microphone and try again.";
              break;
          }
          
          toast({
            title: "Voice Recognition Error",
            description: errorMessage,
            variant: "destructive"
          });
        };

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };
      }

      isInitializedRef.current = true;
      
      // Welcome message after initialization
      setTimeout(() => {
        speak("Hello! I'm your GUDPALS voice assistant. I'm here to help you navigate the app. Say 'help' to learn what I can do, or click the microphone to start.");
      }, 1500);

    } catch (error) {
      console.error('Error initializing voice assistant:', error);
      toast({
        title: "Voice Assistant Error",
        description: "Failed to initialize voice assistant. Some features may not work.",
        variant: "destructive"
      });
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    isInitializedRef.current = false;
  };

  const speak = (text: string) => {
    if (!synthRef.current || !isEnabled) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for a soft, pleasant voice
    const voices = synthRef.current.getVoices();
    
    // Try to find a female voice for softer tone
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Female') || voice.name.includes('woman') || voice.name.includes('Samantha') || voice.name.includes('Victoria'))
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Configure for soft, pleasant speech
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher pitch for warmth
    utterance.volume = 0.8; // Softer volume
    
    utterance.onstart = () => {
      console.log('Speech synthesis started');
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      console.log('Speech synthesis ended');
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    setCurrentMessage(text);
    synthRef.current.speak(utterance);
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setMicPermission('granted');
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setMicPermission('denied');
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice commands.",
        variant: "destructive"
      });
      return false;
    }
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    // Check microphone permission
    if (micPermission !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    try {
      // Stop any ongoing recognition
      if (isListening) {
        recognitionRef.current.stop();
        return;
      }

      console.log('Starting speech recognition');
      recognitionRef.current.start();
      speak("I'm listening... Please speak now.");
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "Failed to start listening. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
    }
  };

  const handleVoiceCommand = async (command: string) => {
    console.log('Processing voice command:', command);
    
    try {
      const response = await voiceAssistantService.processCommand(command, location.pathname);
      speak(response.message);
      
      if (response.action) {
        // Handle navigation or other actions using React Router
        setTimeout(() => {
          if (response.action?.type === 'navigate' && response.action.path) {
            navigate(response.action.path);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speak("I'm sorry, I didn't understand that. Please try again or say 'help' for available commands.");
    }
  };

  const toggleVoiceAssistant = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (newState) {
      speak("Voice assistant enabled. How can I help you today?");
    } else {
      synthRef.current?.cancel();
      setIsSpeaking(false);
      if (isListening) {
        stopListening();
      }
    }
  };

  const showHelp = () => {
    const helpMessage = voiceAssistantService.getContextualHelp(location.pathname);
    speak(helpMessage);
  };

  // Use mobile version on mobile devices
  if (isMobile) {
    return (
      <MobileVoiceAssistant
        className={className}
        isListening={isListening}
        isSpeaking={isSpeaking}
        isEnabled={isEnabled}
        currentMessage={currentMessage}
        micPermission={micPermission}
        onStartListening={startListening}
        onStopListening={stopListening}
        onToggleEnabled={toggleVoiceAssistant}
        onShowHelp={showHelp}
      />
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <div className="flex flex-col items-end gap-2">
        {/* Current message display */}
        {currentMessage && isSpeaking && (
          <div className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg max-w-xs text-sm animate-pulse">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>{currentMessage}</span>
            </div>
          </div>
        )}
        
        {/* Control buttons */}
        <div className="flex gap-2">
          <Button
            onClick={showHelp}
            size="sm"
            variant="outline"
            className="bg-white shadow-lg hover:bg-primary hover:text-white transition-colors focus-ring"
            title="Get help"
            aria-label="Get voice command help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={toggleVoiceAssistant}
            size="sm"
            variant="outline"
            className={cn(
              "bg-white shadow-lg transition-colors focus-ring",
              isEnabled ? "hover:bg-primary hover:text-white" : "bg-gray-200 text-gray-500"
            )}
            title={isEnabled ? "Disable voice assistant" : "Enable voice assistant"}
            aria-label={isEnabled ? "Disable voice assistant" : "Enable voice assistant"}
          >
            {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!isEnabled}
            size="lg"
            className={cn(
              "shadow-lg transition-all duration-200 focus-ring",
              isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-primary hover:bg-primary/90",
              !isEnabled && "opacity-50 cursor-not-allowed"
            )}
            title={isListening ? "Stop listening" : "Start listening"}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>

        {/* Microphone permission warning */}
        {micPermission === 'denied' && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-xs max-w-xs">
            Microphone access is required for voice commands. Please allow access in your browser settings.
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
