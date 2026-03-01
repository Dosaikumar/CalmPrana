import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { StorageService } from './storage';

export type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'HoldOut' | 'Idle';
export type BreathingCycle = {
  name: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
};

@Injectable({
  providedIn: 'root'
})
export class BreathingService {
  public cycles: BreathingCycle[] = [
    { name: '4-4-6', inhale: 4, holdIn: 4, exhale: 6, holdOut: 0 },
    { name: '4-7-8', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
    { name: 'Box Breathing', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  ];

  public currentPhase$ = new BehaviorSubject<BreathingPhase>('Idle');
  public timeLeft$ = new BehaviorSubject<number>(0);
  public isRunning$ = new BehaviorSubject<boolean>(false);
  public progress$ = new BehaviorSubject<number>(0);

  private timerSub?: Subscription;
  private sessionAccumulatedMs = 0;

  // Unified Audio Context for generative ambient and voice beeps
  private audioCtx?: AudioContext;
  private bgGain?: GainNode;
  private bgOscillators: any[] = []; // Stores active background drone oscillators

  private bgVolume = 0.2;
  private musicEnabled = true;
  private voiceEnabled = true;

  private activeCycle?: BreathingCycle;

  constructor(private storage: StorageService) {
    this.loadAudioSettings();
  }

  async loadAudioSettings() {
    const music = await this.storage.get('musicEnabled');
    if (music !== null && music !== undefined) this.musicEnabled = music;

    const voice = await this.storage.get('voiceEnabled');
    if (voice !== null && voice !== undefined) this.voiceEnabled = voice;
  }

  updateSettings(music: boolean, voice: boolean) {
    this.musicEnabled = music;
    this.voiceEnabled = voice;

    if (!this.musicEnabled) {
      this.stopBackgroundMusic();
    } else if (this.isRunning$.value) {
      this.startBackgroundMusic();
    }
  }

  startSession(cycle: BreathingCycle) {
    this.activeCycle = cycle;
    this.stopSession();
    this.resumeSession();
  }

  // --- AUDIO GENERATION ---
  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) this.audioCtx = new AudioContextClass();
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Play ultra-short silent sound to unlock audio on iOS and Android restricted WebViews
    if (this.audioCtx) {
      const unlockOsc = this.audioCtx.createOscillator();
      const unlockGain = this.audioCtx.createGain();
      unlockGain.gain.value = 0;
      unlockOsc.connect(unlockGain);
      unlockGain.connect(this.audioCtx.destination);
      unlockOsc.start();
      unlockOsc.stop(this.audioCtx.currentTime + 0.01);
    }
  }

  private startBackgroundMusic() {
    if (!this.musicEnabled || !this.audioCtx) return;
    if (this.bgOscillators.length > 0) return; // Already playing

    this.bgGain = this.audioCtx.createGain();
    this.bgGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.bgGain.gain.linearRampToValueAtTime(this.bgVolume, this.audioCtx.currentTime + 2); // 2s fade in
    this.bgGain.connect(this.audioCtx.destination);

    // Create a calming ambient chord (C minor 9ish)
    const frequencies = [130.81, 196.00, 233.08, 293.66]; // C3, G3, A#3, D4
    frequencies.forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const lfo = this.audioCtx!.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + Math.random() * 0.1; // Very slow LFO for movement

      const lfoGain = this.audioCtx!.createGain();
      lfoGain.gain.value = 2.0; // Subtle pitch variance (chorus-like)

      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);

      // Pan to create wide spatial stereo feel
      const panner = this.audioCtx!.createStereoPanner();
      panner.pan.value = (i % 2 === 0 ? -1 : 1) * 0.5;

      osc.connect(panner);
      panner.connect(this.bgGain!);

      osc.start();
      lfo.start();
      this.bgOscillators.push(osc, lfo);
    });
  }

  private stopBackgroundMusic() {
    if (this.bgGain && this.audioCtx) {
      // Fade out to prevent popping
      this.bgGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 1);
      setTimeout(() => {
        this.bgOscillators.forEach(node => node.stop());
        this.bgOscillators = [];
        this.bgGain?.disconnect();
      }, 1000);
    } else {
      this.bgOscillators.forEach(node => node.stop());
      this.bgOscillators = [];
    }
  }

  playVoice(phase: BreathingPhase) {
    if (!this.voiceEnabled || !this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    // Cues using simple harmonious frequencies
    if (phase === 'Inhale') {
      osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
    } else if (phase === 'Exhale') {
      osc.frequency.setValueAtTime(440.00, this.audioCtx.currentTime); // A4
    } else if (phase === 'Hold' || phase === 'HoldOut') {
      osc.frequency.setValueAtTime(493.88, this.audioCtx.currentTime); // B4
    }

    // Smooth bell-like envelope
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.audioCtx.currentTime + 0.05); // quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2); // long tail

    osc.start(this.audioCtx.currentTime);
    osc.stop(this.audioCtx.currentTime + 1.2);
  }
  // --- END AUDIO GENERATION ---

  resumeSession() {
    if (!this.activeCycle) return;
    this.isRunning$.next(true);

    // Initialize Web Audio and unlock via synchronous user-gesture
    this.initAudio();
    this.startBackgroundMusic();

    if (this.currentPhase$.value === 'Idle') {
      this.currentPhase$.next('Inhale');
      this.timeLeft$.next(this.activeCycle.inhale);
      this.progress$.next(1);
      this.playVoice('Inhale');
    }

    this.timerSub = timer(1000, 1000).subscribe(() => {
      let currentLeft = this.timeLeft$.value - 1;
      let phase = this.currentPhase$.value;
      const cycle = this.activeCycle!;

      if (currentLeft <= 0) {
        if (phase === 'Inhale') {
          phase = cycle.holdIn > 0 ? 'Hold' : 'Exhale';
        } else if (phase === 'Hold') {
          phase = 'Exhale';
        } else if (phase === 'Exhale') {
          phase = cycle.holdOut > 0 ? 'HoldOut' : 'Inhale';
        } else if (phase === 'HoldOut') {
          phase = 'Inhale';
        }

        if (phase === 'Inhale') currentLeft = cycle.inhale;
        else if (phase === 'Hold') currentLeft = cycle.holdIn;
        else if (phase === 'Exhale') currentLeft = cycle.exhale;
        else if (phase === 'HoldOut') currentLeft = cycle.holdOut;

        this.playVoice(phase);
      }

      this.currentPhase$.next(phase);
      this.timeLeft$.next(currentLeft);

      const totalPhaseTime = phase === 'Inhale' ? cycle.inhale :
        phase === 'Hold' ? cycle.holdIn :
          phase === 'Exhale' ? cycle.exhale : cycle.holdOut;

      this.progress$.next(currentLeft / totalPhaseTime);

      // Save time accumulator
      this.sessionAccumulatedMs += 1000;
      if (this.sessionAccumulatedMs >= 10000) {
        this.storage.addPracticeTime(this.sessionAccumulatedMs);
        this.sessionAccumulatedMs = 0;
      }
    });
  }

  pauseSession() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
    if (this.sessionAccumulatedMs > 0) {
      this.storage.addPracticeTime(this.sessionAccumulatedMs);
      this.sessionAccumulatedMs = 0;
    }
    this.stopBackgroundMusic();
    this.isRunning$.next(false);
  }

  stopSession() {
    this.pauseSession();
    this.currentPhase$.next('Idle');
    this.timeLeft$.next(0);
    this.progress$.next(0);
  }
}
