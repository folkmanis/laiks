import { TestBed } from '@angular/core/testing';

import { LocalSettings } from './local-settings';
import { LocalSettingsService } from './local-settings.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

const TEST_SETTINGS: LocalSettings = {
  offset: 10,
};

describe('SettingsService', () => {
  let service: LocalSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(LocalSettingsService);
    window.localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update and read settings', () => {
    service.setOffset(TEST_SETTINGS.offset);
    expect(service.offset()).toEqual(TEST_SETTINGS.offset);
  });
});
