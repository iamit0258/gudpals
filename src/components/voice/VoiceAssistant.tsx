
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { voiceAssistantService } from '@/services/voiceAssistantService';

interface VoiceAssistantProps {
  className?: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const location = useLocation();
  const { toast } = useToast();
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check your microphone settings.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Welcome message when component mounts
    setTimeout(() => {
      speak("Hello! I'm your GUDPALS voice assistant. Say 'help' to learn what I can do, or click the microphone to start.");
    }, 1000);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current || !isEnabled) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synthRef.current.getVoices().find(voice => voice.lang === 'en-US') || null;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    setCurrentMessage(text);
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);
    recognitionRef.current.start();
    speak("I'm listening...");
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleVoiceCommand = async (command: string) => {
    console.log('Voice command received:', command);
    
    try {
      const response = await voiceAssistantService.processCommand(command, location.pathname);
      speak(response.message);
      
      if (response.action) {
        // Handle navigation or other actions
        setTimeout(() => {
          if (response.action?.type === 'navigate' && response.action.path) {
            window.location.href = response.action.path;
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speak("I'm sorry, I didn't understand that. Please try again or say 'help' for available commands.");
    }
  };

  const toggleVoiceAssistant = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      speak("Voice assistant enabled. How can I help you?");
    } else {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  const showHelp = () => {
    const helpMessage = voiceAssistantService.getContextualHelp(location.pathname);
    speak(helpMessage);
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <div className="flex flex-col items-end gap-2">
        {/* Current message display */}
        {currentMessage && isSpeaking && (
          <div className="bg-dhayan-teal text-white px-4 py-2 rounded-lg shadow-lg max-w-xs text-sm">
            {currentMessage}
          </div>
        )}
        
        {/* Control buttons */}
        <div className="flex gap-2">
          <Button
            onClick={showHelp}
            size="sm"
            variant="outline"
            className="bg-white shadow-lg hover:bg-dhayan-teal hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={toggleVoiceAssistant}
            size="sm"
            variant="outline"
            className={cn(
              "bg-white shadow-lg",
              isEnabled ? "hover:bg-dhayan-teal hover:text-white" : "bg-gray-200"
            )}
          >
            {isEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!isEnabled}
            size="lg"
            className={cn(
              "shadow-lg transition-all duration-200",
              isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-dhayan-teal hover:bg-dhayan-teal/90"
            )}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
