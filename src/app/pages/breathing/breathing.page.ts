import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { BreathingService, BreathingCycle } from '../../core/services/breathing';
import { BreathingCircleComponent } from '../../shared/components/breathing-circle/breathing-circle.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breathing',
  templateUrl: './breathing.page.html',
  styleUrls: ['./breathing.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption, CommonModule, FormsModule, BreathingCircleComponent]
})
export class BreathingPage implements OnInit, OnDestroy {
  public cycles: BreathingCycle[] = [];
  public selectedCycle: BreathingCycle;
  public isRunning: boolean = false;
  public hasStarted: boolean = false;
  private subs: Subscription = new Subscription();

  constructor(private breathingService: BreathingService) {
    this.cycles = this.breathingService.cycles;
    this.selectedCycle = this.cycles[0];
  }

  ngOnInit() {
    this.subs.add(this.breathingService.isRunning$.subscribe(r => this.isRunning = r));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  startSession() {
    this.breathingService.startSession(this.selectedCycle);
  }

  stopSession() {
    this.breathingService.stopSession();
  }

  onCircleTapped() {
    if (this.isRunning) {
      this.stopSession();
    } else {
      this.startSession();
    }
  }

  onCycleChange(event: any) {
    if (this.isRunning) {
      this.breathingService.stopSession();
      this.breathingService.startSession(this.selectedCycle);
    }
  }
}
