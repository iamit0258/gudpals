
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { hybridVoiceService } from '@/services/hybridVoiceService';
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
  const [detectedLanguage, setDetectedLanguage] = useState<string>('en');
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const isInitializedRef = useRef(false);
  const isProcessingRef = useRef(false);

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
      
      isInitializedRef.current = true;
      console.log('Hybrid voice assistant initialized successfully');

    } catch (error) {
      console.error('Error initializing voice assistant:', error);
      toast({
        title: "Voice Assistant Error",
        description: "Failed to initialize voice assistant.",
        variant: "destructive"
      });
    }
  };

  const cleanup = () => {
    hybridVoiceService.cleanup();
    isInitializedRef.current = false;
  };

  const speak = async (text: string) => {
    if (!isEnabled) {
      console.log('Voice assistant disabled');
      return;
    }

    try {
      setIsSpeaking(true);
      setCurrentMessage(text);
      
      const audioBase64 = await hybridVoiceService.textToSpeech(text, detectedLanguage);
      await hybridVoiceService.playAudio(audioBase64);
      
      setIsSpeaking(false);
      console.log('Speech completed');
    } catch (error) {
      console.error('Error in speak function:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Unable to speak the message. Please try again.",
        variant: "destructive"
      });
    }
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
    // Check microphone permission
    if (micPermission !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    if (isProcessingRef.current) {
      console.log('Already processing, ignoring request');
      return;
    }

    try {
      setIsListening(true);
      console.log('Starting recording...');
      
      await hybridVoiceService.startRecording();
      toast({
        title: "Listening",
        description: "Speak now... (Hindi or English)",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsListening(false);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopListening = async () => {
    if (!isListening || isProcessingRef.current) return;

    try {
      isProcessingRef.current = true;
      setIsListening(false);
      
      console.log('Stopping recording...');
      const recording = await hybridVoiceService.stopRecording();
      
      toast({
        title: "Processing",
        description: "Transcribing your speech...",
      });

      // Transcribe audio
      const { text, language } = await hybridVoiceService.transcribeAudio(recording.base64Audio);
      console.log('Transcription:', text, 'Language:', language);
      setDetectedLanguage(language);
      
      if (!text.trim()) {
        toast({
          title: "No Speech Detected",
          description: "Please try again and speak clearly.",
          variant: "destructive"
        });
        isProcessingRef.current = false;
        return;
      }

      setCurrentMessage(text);
      
      // Get AI response
      toast({
        title: "Thinking",
        description: "Getting AI response...",
      });
      
      const reply = await hybridVoiceService.getAIResponse(text, language);
      console.log('AI Reply:', reply);
      
      // Speak the response
      await speak(reply);
      
      isProcessingRef.current = false;
      
    } catch (error) {
      console.error('Error processing voice:', error);
      isProcessingRef.current = false;
      toast({
        title: "Processing Error",
        description: "Failed to process your speech. Please try again.",
        variant: "destructive"
      });
    }
  };


  const toggleVoiceAssistant = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (newState) {
      toast({
        title: "Voice Assistant Enabled",
        description: "Hybrid AI voice assistant with Hindi/English support",
      });
    } else {
      hybridVoiceService.stopAudio();
      setIsSpeaking(false);
      if (isListening) {
        stopListening();
      }
      toast({
        title: "Voice Assistant Disabled",
        description: "Voice commands are now turned off.",
      });
    }
  };

  const showHelp = () => {
    const helpMessage = "I am your AI assistant. I can speak and understand both Hindi and English. Just press the microphone button and speak naturally.";
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
