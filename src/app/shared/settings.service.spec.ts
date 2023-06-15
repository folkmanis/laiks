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
    window.localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default offset', () => {
    const offset = service.offset;
    expect(offset()).toEqual(DEFAULT_SETTINGS.offset);
  });

  it('should update and read settings', () => {
    service.setOffset(TEST_SETTINGS.offset);
    expect(service.offset()).toEqual(TEST_SETTINGS.offset);
  });


});
