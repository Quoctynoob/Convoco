// src/utils/googleSpeechToText.ts
import RecordRTC from 'recordrtc';

class GoogleSpeechToText {
  recorder: RecordRTC | null = null;
  stream: MediaStream | null = null;
  isRecording: boolean = false;
  
  async start(): Promise<boolean> {
    if (this.isRecording) return false;
    
    try {
      // Get microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize recorder
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 48000,
      });
      
      // Start recording
      this.recorder.startRecording();
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Error starting recorder:', error);
      this.cleanup();
      return false;
    }
  }
  
  async stop(): Promise<string> {
    if (!this.isRecording || !this.recorder) {
      return '';
    }
    
    return new Promise((resolve, reject) => {
      this.recorder!.stopRecording(async () => {
        try {
          // Get the audio blob
          const blob = this.recorder!.getBlob();
          
          // Clean up
          this.cleanup();
          
          // Send to API for transcription
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');
          
          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Speech-to-text request failed');
          }
          
          const data = await response.json();
          resolve(data.transcription || '');
        } catch (error) {
          console.error('Error processing recording:', error);
          reject(error);
        }
      });
    });
  }
  
  cleanup() {
    if (this.recorder) {
      this.recorder.destroy();
      this.recorder = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.isRecording = false;
  }
  
  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

export default new GoogleSpeechToText();