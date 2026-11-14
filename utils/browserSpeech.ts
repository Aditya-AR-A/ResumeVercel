export type VoiceStatus = 'idle' | 'starting' | 'listening' | 'speaking';
interface RecognitionResult { isFinal: boolean; 0: { transcript: string } }
interface RecognitionEvent { results: { length: number; [index: number]: RecognitionResult } }
export interface BrowserRecognition {
  lang: string; continuous: boolean; interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start(): void; stop(): void; abort(): void;
}
interface SpeechEnvironment {
  SpeechRecognition?: new () => BrowserRecognition;
  webkitSpeechRecognition?: new () => BrowserRecognition;
  speechSynthesis?: Pick<SpeechSynthesis, 'speak' | 'cancel' | 'getVoices'>;
  SpeechSynthesisUtterance?: new (text: string) => SpeechSynthesisUtterance;
  setTimeout(callback: () => void, delay: number): number;
  clearTimeout(id: number): void;
}
interface SpeechCallbacks {
  onStatus(status: VoiceStatus): void;
  onTranscript(text: string): void;
  onInterim(text: string): void;
  onError(message: string): void;
}
export function speechErrorMessage(error: string): string {
  if (['not-allowed', 'service-not-allowed'].includes(error)) return 'Microphone or speech access was denied. You can type your question below.';
  if (error === 'audio-capture') return 'No microphone is available. Connect one, or type your question.';
  if (error === 'network') return 'The browser speech service could not connect. You can still type or choose a topic.';
  if (error === 'no-speech') return 'No speech was detected. Try again, or type your question.';
  if (error === 'language-not-supported') return 'English voice recognition is unavailable here. Please use the text input.';
  return 'Voice input is unavailable right now. Your text input still works.';
}

// This adapter uses browser speech services only. No paid API, audio upload,
// recording storage, transcript persistence or background listening is added.
export class BrowserSpeech {
  private recognition: BrowserRecognition | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private listenTimer?: number;
  private speakTimer?: number;
  readonly canListen: boolean;
  readonly canSpeak: boolean;

  constructor(private env: SpeechEnvironment, private callbacks: SpeechCallbacks) {
    this.canListen = Boolean(env.SpeechRecognition || env.webkitSpeechRecognition);
    this.canSpeak = Boolean(env.speechSynthesis && env.SpeechSynthesisUtterance);
  }

  private clearListenTimer() {
    if (this.listenTimer !== undefined) this.env.clearTimeout(this.listenTimer);
    this.listenTimer = undefined;
  }
  private cancelRecognition() {
    const recognition = this.recognition;
    this.recognition = null;
    this.clearListenTimer();
    if (recognition) { try { recognition.abort(); } catch { /* Already stopped. */ } }
    this.callbacks.onInterim('');
  }
  private cancelPlayback() {
    this.utterance = null;
    if (this.speakTimer !== undefined) this.env.clearTimeout(this.speakTimer);
    this.speakTimer = undefined;
    this.env.speechSynthesis?.cancel();
  }
  stop() {
    this.cancelRecognition();
    this.cancelPlayback();
    this.callbacks.onStatus('idle');
  }

  listen() {
    this.stop();
    const Constructor = this.env.SpeechRecognition || this.env.webkitSpeechRecognition;
    if (!Constructor) { this.callbacks.onError('This browser does not support voice input. You can type or choose a topic.'); return; }
    let recognition: BrowserRecognition;
    try { recognition = new Constructor(); }
    catch { this.callbacks.onError(speechErrorMessage('unavailable')); return; }
    this.recognition = recognition;
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    let finalText = '';
    recognition.onstart = () => { if (this.recognition === recognition) this.callbacks.onStatus('listening'); };
    recognition.onresult = event => {
      if (this.recognition !== recognition) return;
      const finals: string[] = [], interim: string[] = [];
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        (result.isFinal ? finals : interim).push(result[0].transcript);
      }
      finalText = finals.join(' ').trim().slice(0, 500);
      this.callbacks.onInterim(interim.join(' ').slice(0, 500));
    };
    recognition.onerror = event => {
      if (this.recognition !== recognition) return;
      this.cancelRecognition();
      this.callbacks.onStatus('idle');
      if (event.error !== 'aborted') this.callbacks.onError(speechErrorMessage(event.error));
    };
    recognition.onend = () => {
      if (this.recognition !== recognition) return;
      this.recognition = null;
      this.clearListenTimer();
      this.callbacks.onInterim('');
      this.callbacks.onStatus('idle');
      if (finalText) this.callbacks.onTranscript(finalText);
      else this.callbacks.onError(speechErrorMessage('no-speech'));
    };
    this.callbacks.onStatus('starting');
    try {
      recognition.start();
      this.listenTimer = this.env.setTimeout(() => {
        if (this.recognition !== recognition) return;
        this.cancelRecognition(); this.callbacks.onStatus('idle');
        if (finalText) this.callbacks.onTranscript(finalText);
        else this.callbacks.onError('Listening stopped after 20 seconds. Try a shorter question or type it below.');
      }, 20000);
    } catch {
      this.cancelRecognition(); this.callbacks.onStatus('idle');
      this.callbacks.onError(speechErrorMessage('unavailable'));
    }
  }

  finishListening() {
    const recognition = this.recognition;
    if (!recognition) return;
    try { recognition.stop(); }
    catch { this.stop(); this.callbacks.onError(speechErrorMessage('unavailable')); }
  }

  speak(text: string) {
    this.stop();
    const Constructor = this.env.SpeechSynthesisUtterance;
    const synth = this.env.speechSynthesis;
    if (!Constructor || !synth) { this.callbacks.onError('Read-aloud is unavailable in this browser. The answer remains on screen.'); return; }
    const utterance = new Constructor(text.slice(0, 900));
    utterance.lang = 'en-IN'; utterance.rate = 1; utterance.pitch = 1;
    const voices = synth.getVoices().filter(voice => /^en\b/i.test(voice.lang));
    const voice = voices.find(v => v.localService && /^en[-_]IN/i.test(v.lang)) || voices.find(v => v.localService) || voices.find(v => /^en[-_]IN/i.test(v.lang)) || voices[0];
    if (voice) utterance.voice = voice;
    this.utterance = utterance;
    const end = () => { if (this.utterance === utterance) { this.cancelPlayback(); this.callbacks.onStatus('idle'); } };
    utterance.onstart = () => { if (this.utterance === utterance) this.callbacks.onStatus('speaking'); };
    utterance.onend = end;
    utterance.onerror = event => {
      if (this.utterance !== utterance) return;
      end();
      if (!['canceled', 'interrupted'].includes(event.error)) this.callbacks.onError('Audio could not play. You can read the answer on screen.');
    };
    try {
      this.callbacks.onStatus('speaking');
      synth.speak(utterance);
      this.speakTimer = this.env.setTimeout(end, 45000);
    } catch { end(); this.callbacks.onError('Audio could not play. You can read the answer on screen.'); }
  }
}

export function createBrowserSpeech(callbacks: SpeechCallbacks): BrowserSpeech {
  return new BrowserSpeech(window as unknown as SpeechEnvironment, callbacks);
}
