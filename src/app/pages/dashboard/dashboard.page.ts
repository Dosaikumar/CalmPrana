import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonToggle } from '@ionic/angular/standalone';
import { StorageService } from '../../core/services/storage';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonToggle, CommonModule, FormsModule]
})
export class DashboardPage {
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  barChart: any;

  public totalMinutes: number = 0;
  public currentStreak: number = 0;

  public moods = ['Happy', 'Neutral', 'Stressed', 'Sad'];
  public currentMood: string | null = null;
  public todayMoodSaved: boolean = false;

  public inverseMode: boolean = false;

  constructor(private storageService: StorageService) { }

  ionViewWillEnter() {
    this.loadStats();
    this.checkTodayMood();
    this.checkInverseMode();
  }

  ionViewDidEnter() {
    this.barChartMethod();
  }

  async loadStats() {
    const today = new Date().toDateString();
    const lastActive = await this.storageService.get('lastActiveDate');

    if (lastActive !== today) {
      await this.storageService.set('dailyMinutes', 0);
      await this.storageService.set('lastActiveDate', today);
      this.totalMinutes = 0;
    } else {
      const storedMins = await this.storageService.get('dailyMinutes');
      this.totalMinutes = storedMins ? parseInt(storedMins) : 0;
    }

    // Default streak to 0 as requested
    const storedStreak = await this.storageService.get('streak');
    this.currentStreak = storedStreak ? parseInt(storedStreak) : 0;
  }

  async checkTodayMood() {
    const today = new Date().toDateString();
    const History = await this.storageService.get('moodHistory') || {};
    if (History[today]) {
      this.currentMood = History[today];
      this.todayMoodSaved = true;
    }
  }

  changeMood() {
    this.todayMoodSaved = false;
  }

  async setMood(mood: string) {
    this.currentMood = mood;
    this.todayMoodSaved = true;
    const today = new Date().toDateString();

    const History = await this.storageService.get('moodHistory') || {};
    History[today] = mood;
    await this.storageService.set('moodHistory', History);
  }

  async checkInverseMode() {
    const mode = await this.storageService.get('inverseMode');
    this.inverseMode = !!mode;
    document.body.classList.toggle('dark', this.inverseMode);
  }

  async toggleInverseMode() {
    document.body.classList.toggle('dark', this.inverseMode);
    await this.storageService.set('inverseMode', this.inverseMode);
  }

  async barChartMethod() {
    if (!this.barCanvas) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    const labels: string[] = [];
    const data: number[] = [];
    const history = await this.storageService.get('minutesHistory') || {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayString = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = d.toDateString();

      labels.push(dayString);
      let mins = history[dateString] || 0;
      data.push(Math.round(mins));
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Minutes Practiced',
          data: data,
          backgroundColor: '#d4c1ec',
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: false }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}
