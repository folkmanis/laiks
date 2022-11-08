import { Injectable } from '@angular/core';
import { addMinutes, startOfMinute } from 'date-fns';
import { defer, Observable, of, repeat, timer } from 'rxjs';
import { Settings } from './settings';

export const DEFAULT_SETTINGS: Settings = {
  offset: 0,
};

@Injectable({
  providedIn: 'root'
})
export class LaiksService {

  private storage = window.localStorage;

  constructor() { }

  minuteObserver(): Observable<Date> {
    return defer(() => of(new Date())).pipe(
      repeat({
        delay: () => timer(this.timeToNextMinute())
      }),
    );
  }

  getSettings(): Settings {
    const settings = JSON.parse(this.storage.getItem('settings') || '{}') as Partial<Settings>;
    return this.addDefaultSettings({}, settings);
  }

  setSettings(update: Partial<Settings>): Settings {
    const oldSettings = JSON.parse(this.storage.getItem('settings') || '{}') as Partial<Settings>;
    const newSettings = this.addDefaultSettings(update, oldSettings);
    this.storage.setItem('settings', JSON.stringify(newSettings));
    return newSettings;
  }

  resetSettings(): Settings {
    this.storage.setItem('settings', JSON.stringify(DEFAULT_SETTINGS));
    return this.getSettings();
  }

  private addDefaultSettings(update: Partial<Settings>, settings: Partial<Settings> | null): Settings {
    settings = settings || {};
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      ...update,
    };
  }

  private timeToNextMinute(): number {
    const now = new Date();
    return +startOfMinute(addMinutes(now, 1)) - +now;
  }
}
