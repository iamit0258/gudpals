import { supabase } from '@/integrations/supabase/client';

export interface VoiceRecording {
  audioBlob: Blob;
  base64Audio: string;
}

export class HybridVoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<VoiceRecording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const base64Audio = await this.blobToBase64(audioBlob);
          
          // Stop all tracks
          if (this.mediaRecorder?.stream) {
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
          }

          resolve({ audioBlob, base64Audio });
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.stop();
      console.log('Recording stopped');
    });
  }

  async transcribeAudio(base64Audio: string): Promise<{ text: string; language: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;
      
      console.log('Transcription result:', data);
      return {
        text: data.text,
        language: data.language || 'en'
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async getAIResponse(message: string, language: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { message, language }
      });

      if (error) throw error;
      
      console.log('AI response:', data.reply);
      return data.reply;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  }

  async textToSpeech(text: string, language: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, language }
      });

      if (error) throw error;
      
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
        // Convert base64 to blob
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        // Create or reuse audio element
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
        console.log('Playing audio');
      } catch (error) {
        reject(error);
      }
    });
  }

  stopAudio(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  cleanup(): void {
    this.stopAudio();
    if (this.mediaRecorder?.stream) {
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export const hybridVoiceService = new HybridVoiceService();
