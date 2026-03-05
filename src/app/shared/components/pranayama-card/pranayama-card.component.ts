import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';

export interface Pranayama {
  name: string;
  description: string;
  benefits: string[];
  audioUrl?: string;
}

@Component({
  selector: 'app-pranayama-card',
  templateUrl: './pranayama-card.component.html',
  styleUrls: ['./pranayama-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class PranayamaCardComponent {
  @Input() data!: Pranayama;
  public expanded = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
