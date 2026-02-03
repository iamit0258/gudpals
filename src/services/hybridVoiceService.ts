import { supabase } from '@/integrations/supabase/client';

export class HybridVoiceService {
  private recognition: SpeechRecognition | null = null;
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isListening: boolean = false;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false; // Stop after one sentence/command
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US'; // Default to English, can be changed
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  startListening(
    onResult: (text: string) => void,
    onError: (error: any) => void,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError('Web Speech API not supported');
      return;
    }

    if (this.isListening) return;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      console.log('Voice recognized:', text);
      onResult(text);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      console.log('Started listening via Web Speech API');
    } catch (err) {
      console.error('Failed to start recognition:', err);
      onError(err);
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async getAIResponse(message: string, language: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { action: 'chat', message, language }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      console.log('AI response:', data.reply);
      return data.reply;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  }

  private applyPronunciationFix(text: string): string {
    return text
      .replace(/niva/gi, "Nee-vah")
      .replace(/gudpals/gi, "Goodpals")
      .replace(/b\. tech/gi, "B Tech");
  }

  async textToSpeech(text: string, language: string): Promise<string> {
    try {
      const phoneticText = this.applyPronunciationFix(text);
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { action: 'tts', text: phoneticText, language }
      });

      if (error) throw error;
      if (data?.error || !data?.audioContent) throw new Error(data?.error || "No audio content received");

      console.log('TTS audio generated');
      return data.audioContent;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  async playAudio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!base64Audio) {
          console.error("No audio content received");
          resolve();
          return;
        }

        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        if (!this.audioElement) {
          this.audioElement = new Audio();
        }

        this.audioElement.src = url;
        this.audioElement.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        this.audioElement.onerror = (error) => {
          URL.revokeObjectURL(url);
          reject(error);
        };

        this.audioElement.play();
        console.log('Playing ElevenLabs audio');
      } catch (error) {
        reject(error);
      }
    });
  }

  async speakWithBrowser(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const phoneticText = this.applyPronunciationFix(text);
      const utterance = new SpeechSynthesisUtterance(phoneticText);

      // Get voices
      let voices = window.speechSynthesis.getVoices();

      // If voices aren't loaded yet, wait for them
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          this.setFemaleVoice(utterance, voices);
          window.speechSynthesis.speak(utterance);
        };
      } else {
        this.setFemaleVoice(utterance, voices);
        window.speechSynthesis.speak(utterance);
      }

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        resolve(); // Resolve anyway to not block
      };
    });
  }

  private setFemaleVoice(utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) {
    // Priority list for female voices
    const preferredVoices = [
      "Microsoft Zira", // Windows
      "Google US English", // Chrome
      "Samantha", // MacOS
      "Female", // Generic
    ];

    const selectedVoice = voices.find(voice =>
      preferredVoices.some(preferred => voice.name.includes(preferred)) ||
      voice.name.toLowerCase().includes('female')
    );

    if (selectedVoice) {
      console.log('Selected voice:', selectedVoice.name);
      utterance.voice = selectedVoice;
    } else {
      console.log('No female voice found, using default');
    }

    // Adjust rate/pitch for Niva persona
    utterance.rate = 0.9; // Slightly slower
    utterance.pitch = 0.9; // Slightly lower (calmer)
  }

  stopAudio(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    // Also cancel browser TTS just in case
    window.speechSynthesis.cancel();
  }

  cleanup(): void {
    this.stopAudio();
    this.stopListening();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export const hybridVoiceService = new HybridVoiceService();
