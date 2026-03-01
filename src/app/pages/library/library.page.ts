import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { PranayamaCardComponent, Pranayama } from '../../shared/components/pranayama-card/pranayama-card.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, PranayamaCardComponent]
})
export class LibraryPage {
  public library: Pranayama[] = [
    {
      name: 'Anulom Vilom',
      description: 'Alternate nostril breathing. It helps balance the left and right hemispheres of the brain.',
      benefits: ['Reduces stress and anxiety', 'Improves respiratory health', 'Promotes better sleep']
    },
    {
      name: 'Bhramari',
      description: 'Humming bee breath. The vibration calms the mind and nervous system instantly.',
      benefits: ['Instant relief from tension', 'Lowers blood pressure', 'Improves concentration']
    },
    {
      name: 'Kapalbhati',
      description: 'Skull-shining breath. A rapid breathing technique that energizes the body.',
      benefits: ['Improves digestion', 'Increases metabolic rate', 'Clears respiratory passages']
    },
    {
      name: 'Box Breathing',
      description: 'A technique used to calm yourself down with a simple 4-count rotation.',
      benefits: ['Regulates autonomic nervous system', 'Lowers stress', 'Improves mood']
    }
  ];
}
