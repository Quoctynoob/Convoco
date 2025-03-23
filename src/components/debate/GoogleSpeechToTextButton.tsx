// src/components/debate/GoogleSpeechToTextButton.tsx
import React, { useState } from 'react';
import googleSpeechToText from '@/utils/googleSpeechToText';
import { Button } from '@/components/ui/Button';

interface GoogleSpeechToTextButtonProps {
  onSpeechResult: (text: string) => void;
  buttonText?: string;
  recordingText?: string;
  processingText?: string;
  className?: string;
}

const GoogleSpeechToTextButton: React.FC<GoogleSpeechToTextButtonProps> = ({
  onSpeechResult,
  buttonText = "Google Speech",
  recordingText = "Recording...",
  processingText = "Processing...",
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(() => googleSpeechToText.isSupported());

  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsProcessing(true);
      try {
        const transcript = await googleSpeechToText.stop();
        if (transcript) {
          onSpeechResult(transcript);
        }
      } catch (error) {
        console.error('Error processing speech:', error);
      } finally {
        setIsRecording(false);
        setIsProcessing(false);
      }
    } else {
      // Start recording
      const started = await googleSpeechToText.start();
      if (started) {
        setIsRecording(true);
      }
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <Button
      type="button"
      onClick={handleRecording}
      disabled={isProcessing}
      variant={isRecording || isProcessing ? "default" : "outline"}
      className={`flex items-center gap-2 ${
        isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 
        isProcessing ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''
      } ${className}`}
    >
      {isRecording ? (
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
          {recordingText}
        </>
      ) : isProcessing ? (
        <>
          <svg 
            className="animate-spin w-5 h-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {processingText}
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
  );
};

export default GoogleSpeechToTextButton;