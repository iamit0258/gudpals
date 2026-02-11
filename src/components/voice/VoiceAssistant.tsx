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
import { supabase } from '@/integrations/supabase/client';

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

    const checkOrderStatus = async () => {
        try {
            // Get user ID from local session or auth context (simplified here provided we rely on supabase client)
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                const msg = t("login_required") || "Please log in to check your orders.";
                speak(msg);
                navigate("/sign-in");
                return;
            }

            // Fetch latest order
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (!orders || orders.length === 0) {
                speak("You don't have any recent orders.");
                return;
            }

            const latestOrder = orders[0];
            const status = latestOrder.status || "processing";
            // Construct message: "Your order placed on [Date] is currently [Status]"
            const date = new Date(latestOrder.created_at).toLocaleDateString();
            const message = `Your order from ${date} is currently ${status}.`;

            speak(message);

        } catch (error) {
            console.error("Error checking order:", error);
            speak("I couldn't check your order status right now.");
        }
    };

    const checkCartStatus = () => {
        try {
            const cartJson = localStorage.getItem('cart');
            const cart = cartJson ? JSON.parse(cartJson) : [];

            if (cart.length === 0) {
                speak("Your cart is empty.");
            } else {
                const itemCount = cart.reduce((acc: any, item: any) => acc + item.quantity, 0);
                const total = cart.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0);

                const itemWord = itemCount === 1 ? "item" : "items";
                const message = `You have ${itemCount} ${itemWord} in your cart, totaling ${total} rupees. Should I proceed to checkout?`;
                speak(message);
            }
        } catch (error) {
            console.error("Error checking cart:", error);
            speak("I couldn't check your cart.");
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
        if (isListening || isSpeaking || isProcessingRef.current) {
            console.log('Voice assistant already active, ignoring start request');
            return;
        }

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
                        else if (error === 'network') errorMessage = "Chrome's speech service is unreachable. Please check your internet or disable your VPN/Proxy.";
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

                // Handle special e-commerce routes
                if (intent.route === '/check-order-status') {
                    // Check order status logic
                    checkOrderStatus();
                    return;
                }

                if (intent.route === '/check-cart') {
                    // Check cart logic
                    checkCartStatus();
                    return;
                }

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
                    <div className="bg-primary/95 backdrop-blur text-white px-4 py-3 rounded-2xl shadow-xl max-w-xs text-sm animate-in slide-in-from-bottom-2 duration-300 border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
                                <Volume2 className="h-4 w-4" />
                            </div>
                            <span className="font-medium leading-relaxed">{currentMessage}</span>
                        </div>
                    </div>
                )}

                {/* Control buttons */}
                <div className="flex gap-3 items-center">

                    <div className={cn(
                        "flex gap-2 transition-all duration-300",
                        isListening ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                    )}>
                        <Button
                            onClick={showHelp}
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10 bg-white/90 shadow-lg hover:bg-white hover:scale-105 transition-all rounded-full border border-gray-100"
                            title="Get help"
                        >
                            <HelpCircle className="h-5 w-5 text-primary" />
                        </Button>

                        <Button
                            onClick={toggleVoiceAssistant}
                            size="icon"
                            variant="secondary"
                            className={cn(
                                "h-10 w-10 shadow-lg transition-all rounded-full border border-gray-100",
                                isEnabled ? "bg-white/90 hover:bg-white hover:scale-105 text-primary" : "bg-gray-100 text-gray-400"
                            )}
                            title={isEnabled ? "Disable voice" : "Enable voice"}
                        >
                            {isEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                        </Button>
                    </div>

                    <Button
                        onClick={isListening ? stopListening : startListening}
                        disabled={!isEnabled}
                        size="lg"
                        className={cn(
                            "h-14 w-14 rounded-full shadow-xl transition-all duration-300 focus-ring relative overflow-hidden",
                            isListening
                                ? "bg-red-500 hover:bg-red-600 scale-110"
                                : "bg-gradient-to-r from-primary to-primary/80 hover:scale-105",
                            !isEnabled && "opacity-50 grayscale cursor-not-allowed"
                        )}
                    >
                        {isListening ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <span className="absolute inset-0 bg-red-400 animate-ping opacity-75 rounded-full"></span>
                                <MicOff className="h-6 w-6 relative z-10" />
                            </div>
                        ) : (
                            <Mic className="h-6 w-6" />
                        )}
                    </Button>
                </div>

                {/* Microphone permission warning */}
                {
                    micPermission === 'denied' && (
                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs max-w-xs border border-red-100 shadow-sm font-medium">
                            Microphone access is required. Please allow in settings.
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default VoiceAssistant;

