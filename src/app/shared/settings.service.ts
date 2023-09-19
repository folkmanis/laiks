import { Injectable, computed, effect, signal } from '@angular/core';
import { Settings } from './types/settings';

export const DEFAULT_SETTINGS: Settings = {
  offset: 0,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private storage = window.localStorage;

  private _settings = signal(this.getSettings());

  settings = this._settings.asReadonly();

  offset = computed(() => this._settings().offset);

  constructor() {
    effect(() => {
      this.storage.setItem('settings', JSON.stringify(this._settings()));
    });
  }

  setOffset(offset: number) {
    this._settings.mutate((value) => (value.offset = offset));
  }

  resetSettings() {
    this._settings.set(DEFAULT_SETTINGS);
  }

  private getSettings(): Settings {
    const stored = JSON.parse(
      this.storage.getItem('settings') || '{}'
    ) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
    };
  }
}
