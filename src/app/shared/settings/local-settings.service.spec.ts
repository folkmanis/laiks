import { TestBed } from '@angular/core/testing';

import {
  DEFAULT_SETTINGS,
  LocalSettingsService,
} from './local-settings.service';
import { LocalSettings } from './local-settings';

const TEST_SETTINGS: LocalSettings = {
  offset: 10,
};

describe('SettingsService', () => {
  let service: LocalSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
