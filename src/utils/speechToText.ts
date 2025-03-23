// src/utils/speechToText.ts

class SpeechToTextService {
  private recognition: any = null;
  private isListening: boolean = false;
  private interimTranscript: string = '';
  private finalTranscript: string = '';
  private onResultCallback?: (result: { finalTranscript: string, interimTranscript: string }) => void;
  private onEndCallback?: () => void;
  private onErrorCallback?: (error: any) => void;

  constructor() {
    // Check if browser supports SpeechRecognition
    if (typeof window !== 'undefined') {
      // Use any type here to avoid TypeScript errors
      const SpeechRecognition = (window as any).SpeechRecognition || 
                                (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.configureRecognition();
      }
    }
  }

  private configureRecognition() {
    if (!this.recognition) return;

    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US'; // Default language

    // Set up event handlers
    this.recognition.onresult = (event: any) => {
      this.interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript;
        } else {
          this.interimTranscript += event.results[i][0].transcript;
        }
      }
      
      if (this.onResultCallback) {
        this.onResultCallback({
          finalTranscript: this.finalTranscript,
          interimTranscript: this.interimTranscript
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      if (this.onErrorCallback) this.onErrorCallback(event);
    };
  }

  public start(): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not supported in this browser');
      return false;
    }

    if (this.isListening) return true;

    try {
      this.recognition.start();
      this.isListening = true;
      this.finalTranscript = '';
      this.interimTranscript = '';
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  public stop(): void {
    if (!this.recognition || !this.isListening) return;
    
    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  public setLanguage(lang: string): void {
    if (!this.recognition) return;
    this.recognition.lang = lang;
  }

  public clear(): void {
    this.finalTranscript = '';
    this.interimTranscript = '';
    if (this.onResultCallback) {
      this.onResultCallback({
        finalTranscript: '',
        interimTranscript: ''
      });
    }
  }

  public onResult(callback: (result: { finalTranscript: string, interimTranscript: string }) => void): void {
    this.onResultCallback = callback;
  }

  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  public onError(callback: (error: any) => void): void {
    this.onErrorCallback = callback;
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }
}

// Export singleton instance
const speechToText = typeof window !== 'undefined' ? new SpeechToTextService() : null;
export default speechToText;