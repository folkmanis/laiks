import { TestBed } from '@angular/core/testing';

import { DEFAULT_SETTINGS, SettingsService } from './settings.service';
import { Settings } from './settings';

const TEST_SETTINGS: Settings = {
  offset: 10
};

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default settings', () => {
    const settings = service.getSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('should update and read settings', () => {
    service.setSettings(TEST_SETTINGS);
    expect(service.getSettings()).toEqual(TEST_SETTINGS);
  });


});
