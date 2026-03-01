import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequencyModel } from '../../models/frequency.model';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-frequency-card',
  templateUrl: './frequency-card.component.html',
  styleUrls: ['./frequency-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon]
})
export class FrequencyCardComponent implements OnInit {
  @Input() frequency!: FrequencyModel;
  @Input() isActive: boolean = false;
  @Output() play = new EventEmitter<FrequencyModel>();

  constructor() { }

  ngOnInit() { }

  onPlayClick() {
    this.play.emit(this.frequency);
  }
}
