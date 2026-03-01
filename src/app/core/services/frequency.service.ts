import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { FrequencyModel } from '../../shared/models/frequency.model';
import { StorageService } from './storage';

@Injectable({
    providedIn: 'root'
})
export class FrequencyService {
    private audioContext: AudioContext | null = null;
    private leftOsc: OscillatorNode | null = null;
    private rightOsc: OscillatorNode | null = null;
    private masterGain: GainNode | null = null;
    private timerSub?: Subscription;
    private sessionAccumulatedMs = 0;

    public isPlaying$ = new BehaviorSubject<boolean>(false);
    public activeFrequency$ = new BehaviorSubject<FrequencyModel | null>(null);
    public timeLeft$ = new BehaviorSubject<number>(0);
    public volume$ = new BehaviorSubject<number>(0.5); // Default 50%

    private readonly FADE_TIME = 2; // 2 seconds fade in/out

    constructor(private storage: StorageService) {
        this.initAudioContext();
        this.loadLastSettings();
    }

    private initAudioContext() {
        if (!this.audioContext) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            } else {
                console.error('Web Audio API not supported in this browser.');
            }
        }
    }

    private async loadLastSettings() {
        const vol = await this.storage.get('frequency_volume');
        if (vol !== null) {
            this.volume$.next(vol);
        }
    }

    public setVolume(val: number) {
        this.volume$.next(val);
        this.storage.set('frequency_volume', val);

        if (this.masterGain && this.audioContext) {
            this.masterGain.gain.setTargetAtTime(val, this.audioContext.currentTime, 0.1);
        }
    }

    public async play(freq: FrequencyModel, durationMinutes: number) {
        if (!this.audioContext) return;

        // Stop any existing playback first
        if (this.isPlaying$.value) {
            this.pause();
        }

        this.activeFrequency$.next(freq);
        this.timeLeft$.next(durationMinutes * 60);
        this.storage.set('last_frequency_id', freq.id);

        await this.resume();
    }

    public async resume() {
        const freq = this.activeFrequency$.value;
        if (!this.audioContext || !freq || this.timeLeft$.value <= 0) return;

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.isPlaying$.next(true);

        this.masterGain = this.audioContext.createGain();

        // Fade in
        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume$.value, this.audioContext.currentTime + this.FADE_TIME);
        this.masterGain.connect(this.audioContext.destination);

        if (freq.category === 'Brainwave' && freq.offsetHz) {
            // Binaural Beat Setup (Dual Oscillators panned L/R)
            this.leftOsc = this.audioContext.createOscillator();
            this.rightOsc = this.audioContext.createOscillator();

            const leftPanner = this.audioContext.createStereoPanner();
            const rightPanner = this.audioContext.createStereoPanner();

            leftPanner.pan.value = -1;
            rightPanner.pan.value = 1;

            this.leftOsc.frequency.value = freq.baseFrequency;
            this.rightOsc.frequency.value = freq.baseFrequency + freq.offsetHz;

            this.leftOsc.connect(leftPanner);
            this.rightOsc.connect(rightPanner);
            leftPanner.connect(this.masterGain);
            rightPanner.connect(this.masterGain);

            this.leftOsc.start();
            this.rightOsc.start();
        } else {
            // Pure Tone Setup (Single Oscillator centered)
            this.leftOsc = this.audioContext.createOscillator();
            this.leftOsc.frequency.value = freq.baseFrequency;
            this.leftOsc.connect(this.masterGain);
            this.leftOsc.start();
        }

        this.startTimer();
    }

    private startTimer() {
        if (this.timerSub) this.timerSub.unsubscribe();

        this.timerSub = timer(1000, 1000).subscribe(() => {
            const current = this.timeLeft$.value - 1;
            this.timeLeft$.next(current);

            this.sessionAccumulatedMs += 1000;
            if (this.sessionAccumulatedMs >= 10000) {
                this.storage.addPracticeTime(this.sessionAccumulatedMs);
                this.sessionAccumulatedMs = 0;
            }

            if (current <= 0) {
                this.stop();
            } else if (current === this.FADE_TIME && this.masterGain && this.audioContext) {
                // Trigger fade out right before it ends
                this.masterGain.gain.setTargetAtTime(0, this.audioContext.currentTime, this.FADE_TIME / 3);
            }
        });
    }

    public pause() {
        if (!this.isPlaying$.value || !this.audioContext) return;

        if (this.timerSub) {
            this.timerSub.unsubscribe();
        }

        if (this.sessionAccumulatedMs > 0) {
            this.storage.addPracticeTime(this.sessionAccumulatedMs);
            this.sessionAccumulatedMs = 0;
        }

        this.isPlaying$.next(false);

        // Fade out then disconnect oscillators
        if (this.masterGain) {
            const currentTime = this.audioContext.currentTime;
            this.masterGain.gain.cancelScheduledValues(currentTime);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);
            this.masterGain.gain.linearRampToValueAtTime(0, currentTime + this.FADE_TIME);

            setTimeout(() => {
                if (this.leftOsc) {
                    this.leftOsc.stop();
                    this.leftOsc.disconnect();
                    this.leftOsc = null;
                }
                if (this.rightOsc) {
                    this.rightOsc.stop();
                    this.rightOsc.disconnect();
                    this.rightOsc = null;
                }
                if (this.masterGain) {
                    this.masterGain.disconnect();
                    this.masterGain = null;
                }
            }, this.FADE_TIME * 1000 + 100);
        }
    }

    public stop() {
        this.pause();
        this.timeLeft$.next(0);
        this.activeFrequency$.next(null);
    }

    ngOnDestroy() {
        this.stop();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
