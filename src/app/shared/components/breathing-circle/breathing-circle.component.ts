import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { BreathingService, BreathingPhase } from '../../../core/services/breathing';

@Component({
  selector: 'app-breathing-circle',
  templateUrl: './breathing-circle.component.html',
  styleUrls: ['./breathing-circle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonRippleEffect]
})
export class BreathingCircleComponent implements OnInit, OnDestroy {
  public phase: BreathingPhase = 'Idle';
  public timeLeft: number = 0;
  public progress: number = 0;
  public isRunning: boolean = false;

  @Output() circleTapped = new EventEmitter<void>();

  private subs: Subscription = new Subscription();

  constructor(public breathingService: BreathingService) { }

  ngOnInit() {
    this.subs.add(this.breathingService.currentPhase$.subscribe(p => this.phase = p));
    this.subs.add(this.breathingService.timeLeft$.subscribe(t => this.timeLeft = t));
    this.subs.add(this.breathingService.progress$.subscribe(p => this.progress = p));
    this.subs.add(this.breathingService.isRunning$.subscribe(r => this.isRunning = r));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onTap() {
    this.circleTapped.emit();
  }
}
