import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonToggle, IonDatetime, IonDatetimeButton, IonModal, IonList, IonListHeader } from '@ionic/angular/standalone';
import { StorageService } from '../../core/services/storage';
import { NotificationService } from '../../core/services/notification';
import { BreathingService } from '../../core/services/breathing';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonLabel, IonToggle, IonDatetime, IonDatetimeButton, IonModal, IonList, IonListHeader, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  public reminderEnabled: boolean = false;
  public reminderTime: string = '2023-01-01T08:00:00';

  public musicEnabled: boolean = true;
  public voiceEnabled: boolean = true;

  constructor(
    private storage: StorageService,
    private notification: NotificationService,
    private breathingService: BreathingService
  ) { }

  async ngOnInit() {
    await this.loadSettings();
  }

  async loadSettings() {
    const enabled = await this.storage.get('reminderEnabled');
    if (enabled !== null && enabled !== undefined) this.reminderEnabled = enabled;

    const time = await this.storage.get('reminderTime');
    if (time) this.reminderTime = time;

    const music = await this.storage.get('musicEnabled');
    if (music !== null && music !== undefined) this.musicEnabled = music;

    const voice = await this.storage.get('voiceEnabled');
    if (voice !== null && voice !== undefined) this.voiceEnabled = voice;
  }

  async onAudioToggleChange() {
    await this.storage.set('musicEnabled', this.musicEnabled);
    await this.storage.set('voiceEnabled', this.voiceEnabled);
    this.breathingService.updateSettings(this.musicEnabled, this.voiceEnabled);
  }

  async onToggleChange() {
    await this.storage.set('reminderEnabled', this.reminderEnabled);
    this.updateNotification();
  }

  async onTimeChange(event: any) {
    this.reminderTime = event.detail.value;
    await this.storage.set('reminderTime', this.reminderTime);
    if (this.reminderEnabled) {
      this.updateNotification();
    }
  }

  private async updateNotification() {
    if (this.reminderEnabled) {
      const date = new Date(this.reminderTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      await this.notification.scheduleDailyReminder(hours, minutes);
    } else {
      await this.notification.cancelReminders();
    }
  }
}
