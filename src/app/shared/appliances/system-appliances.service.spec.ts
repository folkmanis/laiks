import { TestBed } from '@angular/core/testing';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import {
  loginAdmin,
  logout,
} from '@shared/firebase/test-firebase-provider.spec';
import { firstValueFrom, take } from 'rxjs';
import { PresetPowerAppliance } from './power-appliance.interface';
import { SystemAppliancesService } from './system-appliances.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SystemAppliancesService', () => {
  let service: SystemAppliancesService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        testFirebaseProvider,
        provideExperimentalZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(SystemAppliancesService);
    await loginAdmin();
  });

  afterEach(() => {
    logout();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should contain data', (done) => {
    service
      .getPowerAppliances()
      .pipe(take(1))
      .subscribe((data) => {
        expect(data.length).toBeGreaterThan(0);
        done();
      });
  });

  it('should retrieve, create, update and delete appliance', async () => {
    const appliances = await firstValueFrom(service.getPowerAppliances());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...newAppliance } = appliances[0];
    const newId = await service.createAppliance(newAppliance);
    expect(newId).withContext('created').toBeTruthy();

    const savedAppliance = await service.getAppliance(newId);
    expect(savedAppliance).withContext('retrieved').toEqual(newAppliance);

    const update: PresetPowerAppliance = {
      ...savedAppliance,
      minimumDelay: savedAppliance.minimumDelay + 1,
    };
    await service.updateAppliance(newId, update);
    const updatedAppliance = await service.getAppliance(newId);
    expect(updatedAppliance).toEqual(update);

    await service.deleteAppliance(newId);
    await expectAsync(service.getAppliance(newId))
      .withContext('deleted')
      .toBeRejected();
  });
});
