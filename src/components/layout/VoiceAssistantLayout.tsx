import React from 'react';
import VoiceAssistant from '@/components/voice/VoiceAssistant';

interface VoiceAssistantLayoutProps {
  children: React.ReactNode;
}

const VoiceAssistantLayout: React.FC<VoiceAssistantLayoutProps> = ({ children }) => {
  return (
    <div className="relative">
      {children}
      <VoiceAssistant />
    </div>
  );
};

export default VoiceAssistantLayout;
