import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  async scheduleDailyReminder(hour: number, minute: number) {
    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "CalmPrana Reminder",
          body: "Take a deep breath. It's time for your daily practice.",
          id: 1,
          schedule: {
            on: {
              hour: hour,
              minute: minute,
            },
            allowWhileIdle: true
          }
        }
      ]
    });
  }

  async cancelReminders() {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  }
}
