import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { hybridVoiceService } from '@/services/hybridVoiceService';
import MobileVoiceAssistant from './MobileVoiceAssistant';
import { findIntent } from './nivaIntents';
import { useLanguage } from '@/context/language/LanguageContext';

interface VoiceAssistantProps {
    className?: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ className }) => {
    const { t, language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [currentMessage, setCurrentMessage] = useState('');
    const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [detectedLanguage, setDetectedLanguage] = useState<string>('en');
    const location = useLocation();
    const navigate = useNavigate();
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
                title: t("voice_error"),
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
                title: t("microphone_required"),
                description: t("enable_mic"),
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
            console.log('Starting listening via Web Speech API...');

            hybridVoiceService.startListening(
                // onResult
                (text) => {
                    console.log('Voice result:', text);
                    setCurrentMessage(text);
                    // Process immediately
                    processVoiceCommand(text);
                },
                // onError
                (error) => {
                    console.error('Voice Error:', error);
                    setIsListening(false);

                    let errorMessage = "Could not understand audio.";

                    if (typeof error === 'string') {
                        if (error === 'no-speech') errorMessage = "No speech detected. Try speaking closer to the mic.";
                        else if (error === 'network') errorMessage = "Network error. Please check your connection.";
                        else if (error === 'not-allowed') errorMessage = "Microphone access denied. Please allow permissions.";
                        else errorMessage = `Voice Error: ${error}`;
                    }

                    toast({
                        title: t("voice_error"),
                        description: errorMessage,
                        variant: "destructive"
                    });
                },
                // onEnd
                () => {
                    setIsListening(false);
                    console.log('Listening stopped');
                }
            );

            toast({
                title: t("listening"),
                description: t("speak_now"),
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

    const processVoiceCommand = async (text: string) => {
        // 0. Check for Zodiac Signs (prioritize specific horoscope queries over generic navigation)
        const zodiacSigns = [
            'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
            'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
            'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
            'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
        ];
        const hasZodiac = zodiacSigns.some(sign => text.toLowerCase().includes(sign));

        if (!hasZodiac) {
            // 1. Check for local navigation intents (ONLY if no zodiac sign mentioned)
            const intent = findIntent(text);

            if (intent) {
                console.log('Intent matched:', intent);
                setCurrentMessage(intent.response);

                // Speak confirmation instantly using Browser TTS (faster for navigation)
                setIsSpeaking(true);
                await hybridVoiceService.speakWithBrowser(intent.response);
                setIsSpeaking(false);

                // Then navigate
                if (intent.route) {
                    navigate(intent.route);
                }
                return;
            }
        }

        // 2. If no intent or if it's a zodiac query, fallback to AI (Gemini)
        try {
            if (hasZodiac) {
                // Immediate feedback for horoscope
                const matchedSign = zodiacSigns.find(sign => text.toLowerCase().includes(sign));
                // Use translation for both static text and the sign name
                const displayName = matchedSign ? t(matchedSign) : matchedSign;

                let feedback = "";
                if (language === 'hi') {
                    // Hindi: "Mesh ka rashifal..." (Sign + Key)
                    feedback = `${displayName} ${t("checking_stars")}...`;
                } else {
                    // English: "Horoscope for Aries is..." (Key + Sign + is)
                    feedback = `${t("checking_stars")} ${displayName} is...`;
                }

                toast({ title: t("astrology_title"), description: feedback });

                // Speak feedback instantly
                setIsSpeaking(true);
                await hybridVoiceService.speakWithBrowser(feedback);
                setIsSpeaking(false);
            } else {
                toast({
                    title: t("thinking"),
                    description: t("asking_niva")
                });
            }

            // We pass 'en' as default or detected language
            // Add a 15s timeout to the AI request
            const aiPromise = hybridVoiceService.getAIResponse(text, detectedLanguage);
            const timeoutPromise = new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), 15000)
            );

            const reply = await Promise.race([aiPromise, timeoutPromise]);

            console.log('AI Reply:', reply);
            setCurrentMessage(reply);

            // Try ElevenLabs first
            try {
                setIsSpeaking(true);
                toast({ title: t("speaking"), description: t("generating_voice") });
                const audioBase64 = await hybridVoiceService.textToSpeech(reply, detectedLanguage);
                await hybridVoiceService.playAudio(audioBase64);
            } catch (ttsError) {
                console.warn("ElevenLabs TTS failed, falling back to browser:", ttsError);
                // Fallback to browser TTS
                await hybridVoiceService.speakWithBrowser(reply);
            } finally {
                setIsSpeaking(false);
            }

        } catch (error: any) {
            console.error('Error getting AI response:', error);
            const errMessage = error.message === "Request timed out"
                ? t("connection_timeout")
                : t("connection_error_generic");

            toast({
                title: t("connection_error"),
                description: `${errMessage} ${error.message ? `(${error.message.split('.')[0]})` : ""}`,
                variant: "destructive"
            });

            // Speak error
            await hybridVoiceService.speakWithBrowser(errMessage);
        }
    };

    const stopListening = async () => {
        hybridVoiceService.stopListening();
        setIsListening(false);
    };


    const toggleVoiceAssistant = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);

        if (newState) {
            toast({
                title: t("voice_enabled"),
                description: t("voice_enabled_description"),
            });
        } else {
            hybridVoiceService.stopAudio();
            setIsSpeaking(false);
            if (isListening) {
                stopListening();
            }
            toast({
                title: t("voice_disabled"),
                description: t("voice_disabled_description"),
            });
        }
    };

    const showHelp = () => {
        const helpMessage = t("voice_help");
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
