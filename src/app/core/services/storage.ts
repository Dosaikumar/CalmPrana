import { Injectable } from '@angular/core';
import { Storage as IonicStorage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: IonicStorage | null = null;

  constructor(private storage: IonicStorage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any) {
    if (!this._storage) await this.init();
    await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<any> {
    if (!this._storage) await this.init();
    return await this._storage?.get(key);
  }

  public async addPracticeTime(elapsedMs: number) {
    if (elapsedMs <= 0) return;

    const addedMinutes = elapsedMs / 60000;
    const today = new Date().toDateString();

    let lastActive = await this.get('lastActiveDate');
    let dailyMins = 0;

    let streak = parseInt(await this.get('streak') || '0');

    if (lastActive !== today) {
      await this.set('lastActiveDate', today);
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive === yesterday.toDateString()) {
        streak += 1;
      } else if (lastActive) {
        streak = 1;
      } else {
        streak = 1;
      }
      await this.set('streak', streak);
    } else {
      const storedMins = await this.get('dailyMinutes');
      dailyMins = storedMins ? parseFloat(storedMins) : 0;
    }

    dailyMins += addedMinutes;
    await this.set('dailyMinutes', dailyMins);

    let history = await this.get('minutesHistory') || {};
    if (!history[today]) history[today] = 0;
    history[today] += addedMinutes;

    await this.set('minutesHistory', history);
  }
}
