import { TestBed } from '@angular/core/testing';

import { PowerAppliancesService } from './power-appliances.service';

describe('PowerAppliancesService', () => {
  let service: PowerAppliancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerAppliancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
