import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { waterOutline, leafOutline, bodyOutline, eyeOutline, walkOutline, handRightOutline } from 'ionicons/icons';
import { PranayamaCardComponent, Pranayama } from '../../shared/components/pranayama-card/pranayama-card.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, CommonModule, PranayamaCardComponent]
})
export class LibraryPage {
  constructor() {
    addIcons({ waterOutline, leafOutline, bodyOutline, eyeOutline, walkOutline, handRightOutline });
  }

  public calmingTips = [
    {
      title: '5-4-3-2-1 Grounding',
      description: 'Acknowledge 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.',
      icon: 'eye-outline'
    },
    {
      title: 'Progressive Relaxation',
      description: 'Tense each muscle group for 5 seconds, then relax for 10 seconds, starting from your toes.',
      icon: 'body-outline'
    },
    {
      title: 'Drink Cold Water',
      description: 'Drinking a cold glass of water can help reset your nervous system and bring you to the present.',
      icon: 'water-outline'
    },
    {
      title: 'Get Outdoors',
      description: 'Step outside for 5 minutes. Fresh air and a change of scenery can instantly improve your mood.',
      icon: 'leaf-outline'
    }
  ];

  public asanas: Pranayama[] = [
    {
      name: 'Sukhasana (Easy Pose)',
      description: 'A simple cross-legged sitting posture that promotes inner calm.',
      benefits: ['Elongates the spine', 'Broadens the collarbones', 'Calms the mind']
    },
    {
      name: 'Balasana (Child\'s Pose)',
      description: 'A resting pose that gently stretches the lower back, hips, thighs, and ankles.',
      benefits: ['Relieves back and neck pain', 'Relaxes the mind and body', 'Releases tension']
    },
    {
      name: 'Savasana (Corpse Pose)',
      description: 'A restorative pose played at the end of practice lying flat on the back.',
      benefits: ['Relaxes the whole body', 'Rejuvenates mind and body', 'Reduces headache and fatigue']
    }
  ];

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
