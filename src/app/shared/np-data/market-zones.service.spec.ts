import { TestBed } from '@angular/core/testing';
import { FirestoreTestTools, testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { finalize, from, mergeMap, take, tap } from 'rxjs';
import { MarketZone } from './market-zone';
import { MarketZonesService } from './market-zones.service';

const TEST_ZONE_ID = 'test';

const TEST_ZONE: MarketZone = {
    dbName: 'test',
    description: 'Zone for testing purposes',
    locale: 'tt',
    tax: 0.21,
    url: 'https://fake_path',
    enabled: true,
};

describe('MarketZonesService', () => {

    let service: MarketZonesService;
    let firestoreTestTools: FirestoreTestTools;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                testFirebaseProvider,
                FirestoreTestTools,
            ]
        });

        service = TestBed.inject(MarketZonesService);
        firestoreTestTools = TestBed.inject(FirestoreTestTools);
        await firestoreTestTools.clearAllData();

    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create and delete zone', async () => {
        await service.setZone(TEST_ZONE_ID, TEST_ZONE);
        const zoneCreated = await service.getZone(TEST_ZONE_ID);
        expect(zoneCreated).withContext('zone created').toEqual(TEST_ZONE);
        await service.deleteZone(TEST_ZONE_ID);
        await expectAsync(service.getZone(TEST_ZONE_ID)).withContext('zone deleted').toBeRejected();
    });

    it('should update and receive zones list', (done) => {

        const testCount = 5;
        let lastValue: MarketZone;

        const valueLogger = jasmine.createSpy('Value');

        service.getZonesFlow()
            .pipe(
                take(testCount + 2),
                tap(valueLogger),
                tap(zones => lastValue = zones),
                finalize(() => {
                    expect(valueLogger).toHaveBeenCalledTimes(testCount + 2);
                    expect(lastValue).toContain({ id: TEST_ZONE_ID, ...TEST_ZONE });
                    done();
                })
            )
            .subscribe();

        createMockRecords(testCount);
        service.setZone(TEST_ZONE_ID, TEST_ZONE);

    });

    it('should update record', (done) => {
        const valueLogger = jasmine.createSpy('Value');
        let lastValue: MarketZone;
        const expectedLastValue = { ...TEST_ZONE, locale: 'tv' };
        from(service.setZone(TEST_ZONE_ID, TEST_ZONE)).pipe(
            mergeMap(() => service.updateZone(TEST_ZONE_ID, { locale: 'tv' })),
            mergeMap(() => service.getZoneFlow(TEST_ZONE_ID)),
            tap(zone => {
                lastValue = zone;
                valueLogger();
            }),
            take(1),
            finalize(() => {
                expect(lastValue).toEqual(expectedLastValue);
                expect(valueLogger).toHaveBeenCalled();
                done();
            })
        ).subscribe();


    });

    async function createMockRecords(count: number) {
        for (let i = 0; i < count; i++) {
            await service.setZone('zone' + i, TEST_ZONE);
        }
    }

});
