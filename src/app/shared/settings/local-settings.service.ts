import { Injectable, computed, effect, signal } from '@angular/core';
import { LocalSettings } from './local-settings';

export const DEFAULT_SETTINGS: LocalSettings = {
  offset: 0,
};

@Injectable({
  providedIn: 'root',
})
export class LocalSettingsService {
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

  private getSettings(): LocalSettings {
    const stored = JSON.parse(
      this.storage.getItem('settings') || '{}'
    ) as Partial<LocalSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
    };
  }
}
