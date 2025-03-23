// src/utils/speechToText.ts

type SpeechRecognitionResult = {
  finalTranscript: string;
  interimTranscript: string;
};

class SpeechToTextService {
  recognition: SpeechRecognition | null = null;
  isListening: boolean = false;
  finalTranscript: string = "";
  interimTranscript: string = "";
  resultCallback: ((result: SpeechRecognitionResult) => void) | null = null;
  endCallback: (() => void) | null = null;
  errorCallback: ((error: any) => void) | null = null;

  isSupported(): boolean {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }

  setupRecognition() {
    if (!this.isSupported()) return false;

    // Initialize the recognition object
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.continuous = false; // Changed to false to avoid repetition
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = "en-US"; // Default language

    // Handle results
    this.recognition.onresult = (event) => {
      this.interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript;
        } else {
          this.interimTranscript += event.results[i][0].transcript;
        }
      }

      if (this.resultCallback) {
        this.resultCallback({
          finalTranscript: this.finalTranscript,
          interimTranscript: this.interimTranscript,
        });
      }
    };

    // Handle end of speech
    this.recognition.onend = () => {
      this.isListening = false;
      if (this.endCallback) this.endCallback();
    };

    // Handle errors
    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      if (this.errorCallback) this.errorCallback(event.error || event);
    };

    return true;
  }

  start(): boolean {
    if (this.isListening) return false;
    if (!this.recognition && !this.setupRecognition()) return false;

    try {
      // Reset transcripts before starting
      this.finalTranscript = "";
      this.interimTranscript = "";

      this.recognition!.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.error("Speech recognition error:", e);
      return false;
    }
  }

  stop(): void {
    if (!this.isListening || !this.recognition) return;
    this.recognition.stop();
    this.isListening = false;
  }

  onResult(callback: (result: SpeechRecognitionResult) => void): void {
    this.resultCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.endCallback = callback;
  }

  onError(callback: (error: any) => void): void {
    this.errorCallback = callback;
  }

  setLanguage(language: string): void {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}

// Add these types to make TypeScript happy
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const speechToText = new SpeechToTextService();
export default speechToText;
