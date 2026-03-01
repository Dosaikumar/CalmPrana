import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRange, IonIcon, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { FrequencyService } from '../../core/services/frequency.service';
import { FrequencyModel, FREQUENCY_DATA } from '../../shared/models/frequency.model';
import { FrequencyCardComponent } from '../../shared/components/frequency-card/frequency-card.component';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.page.html',
  styleUrls: ['./frequency.page.scss'],
  standalone: true,
  imports: [IonContent, IonRange, IonIcon, IonButton, IonSelect, IonSelectOption, CommonModule, FormsModule, FrequencyCardComponent]
})
export class FrequencyPage implements OnInit, OnDestroy {

  public brainwaveFrequencies = FREQUENCY_DATA.filter(f => f.category === 'Brainwave');
  public relaxationFrequencies = FREQUENCY_DATA.filter(f => f.category === 'Relaxation');

  public activeFrequency: FrequencyModel | null = null;
  public isPlaying: boolean = false;
  public timeLeft: number = 0;

  public selectedDuration: number = 5; // Default 5 mins
  public durationOptions = [5, 10, 15, 20, 30, 45, 60];

  public volume: number = 50;

  private subs = new Subscription();

  constructor(private frequencyService: FrequencyService) { }

  ngOnInit() {
    this.subs.add(
      this.frequencyService.activeFrequency$.subscribe(f => this.activeFrequency = f)
    );
    this.subs.add(
      this.frequencyService.isPlaying$.subscribe(playing => this.isPlaying = playing)
    );
    this.subs.add(
      this.frequencyService.timeLeft$.subscribe(time => this.timeLeft = time)
    );
    this.subs.add(
      this.frequencyService.volume$.subscribe(v => this.volume = v * 100)
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.frequencyService.stop();
  }

  onPlayFrequency(freq: FrequencyModel) {
    this.frequencyService.play(freq, this.selectedDuration);
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.frequencyService.pause();
    } else {
      if (this.activeFrequency && this.timeLeft > 0) {
        this.frequencyService.resume();
      }
    }
  }

  stopPlayback() {
    this.frequencyService.stop();
  }

  onVolumeChange(event: any) {
    const val = event.detail.value / 100;
    this.frequencyService.setVolume(val);
  }

  formatTime(seconds: number): string {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
