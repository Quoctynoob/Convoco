// src/components/debate/SpeechToTextButton.tsx
import React, { useState, useEffect } from 'react';
import speechToText from '@/utils/speechToText';
import { Button } from '@/components/ui/Button';

interface SpeechToTextButtonProps {
  onSpeechResult: (text: string) => void;
  onSpeechError?: (error: any) => void;
  buttonText?: string;
  listeningText?: string;
  className?: string;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({
  onSpeechResult,
  onSpeechError,
  buttonText = "Speak",
  listeningText = "Listening...",
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if speech recognition is supported
    if (speechToText) {
      setIsSupported(speechToText.isSupported());
      
      // Set up event handlers
      speechToText.onResult(({ finalTranscript, interimTranscript }) => {
        setTranscript(finalTranscript || interimTranscript);
        if (finalTranscript) {
          onSpeechResult(finalTranscript);
        }
      });
      
      speechToText.onEnd(() => {
        setIsListening(false);
      });
      
      speechToText.onError((error) => {
        setIsListening(false);
        if (onSpeechError) onSpeechError(error);
      });
    }
  }, [onSpeechResult, onSpeechError]);

  const toggleListening = () => {
    if (!speechToText) return;
    
    if (isListening) {
      speechToText.stop();
      setIsListening(false);
    } else {
      const started = speechToText.start();
      if (started) {
        setIsListening(true);
      }
    }
  };

  if (!isSupported) {
    return null; // Don't render if speech recognition isn't supported
  }

  return (
    <div className="flex items-center">
      <Button
        type="button"
        onClick={toggleListening}
        variant={isListening ? "default" : "outline"}
        className={`flex items-center gap-2 ${isListening ? 'bg-red-500 hover:bg-red-600 text-white' : ''} ${className}`}
      >
        {isListening ? (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5 animate-pulse"
            >
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
            {listeningText}
          </>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
};

export default SpeechToTextButton;