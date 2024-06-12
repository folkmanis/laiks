import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  PresetPowerAppliance,
  SystemAppliancesService,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import {
  dishWasher,
  washer,
} from '@shared/np-data/price-calculator.service.spec';
import { WithId } from '@shared/utils';
import { BehaviorSubject } from 'rxjs';
import { AppliancesListComponent } from './appliances-list.component';

const testData: WithId<PresetPowerAppliance>[] = [dishWasher, washer].map(
  (appliance, idx) => ({
    ...appliance,
    localizedNames: { lv: appliance.name },
    id: 'id' + idx,
  }),
);

@Component({
  template: `new-appliance-component`,
  standalone: true,
})
class NewApplianceTestComponent {}

@Component({
  template: `appliance-edit-component {{ id }}`,
  standalone: true,
})
class ApplianceEditTestComponent {
  @Input() id: string = '';
}

@Component({
  template: `localized-names-component {{ id }}`,
  standalone: true,
})
class LocalizedNamesTestComponent {
  @Input() id: string = '';
}

describe('AppliancesListComponent', () => {
  let harness: RouterTestingHarness;
  let component: AppliancesListComponent;
  let loader: HarnessLoader;

  let table: MatTableHarness;
  let confirmationDialogMockService: jasmine.SpyObj<ConfirmationDialogService>;

  let mockService: jasmine.SpyObj<SystemAppliancesService>;

  beforeEach(async () => {
    confirmationDialogMockService =
      jasmine.createSpyObj<ConfirmationDialogService>('ConfirmationDialog', [
        'delete',
      ]);
    confirmationDialogMockService.delete.and.resolveTo(true);

    const testData$ = new BehaviorSubject([...testData]);
    mockService = jasmine.createSpyObj<SystemAppliancesService>(
      'SystemAppliancesService',
      ['getPowerAppliances', 'updateAppliance', 'deleteAppliance'],
    );
    mockService.getPowerAppliances.and.returnValue(testData$);
    mockService.updateAppliance.and.callFake(async (id, update) => {
      testData$.next(
        testData$.value.map((value) =>
          value.id === id ? { ...value, ...update } : value,
        ),
      );
    });
    mockService.deleteAppliance.and.callFake(async (id) => {
      testData$.next(testData$.value.filter((value) => value.id !== id));
    });

    TestBed.configureTestingModule({
      imports: [AppliancesListComponent],
      providers: [
        {
          provide: ConfirmationDialogService,
          useValue: confirmationDialogMockService,
        },
        provideRouter(
          [
            {
              path: 'new',
              component: NewApplianceTestComponent,
            },
            {
              path: ':id',
              children: [
                {
                  path: 'localized-names',
                  component: LocalizedNamesTestComponent,
                },
                {
                  path: '',
                  component: ApplianceEditTestComponent,
                },
              ],
            },
            {
              path: '',
              component: AppliancesListComponent,
            },
          ],
          withComponentInputBinding(),
        ),
        { provide: SystemAppliancesService, useValue: mockService },
      ],
    });
    await TestBed.compileComponents();

    harness = await RouterTestingHarness.create();

    component = await harness.navigateByUrl('/', AppliancesListComponent);

    loader = TestbedHarnessEnvironment.loader(harness.fixture);
    table = await loader.getHarness(MatTableHarness);

    harness.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create table', async () => {
    expect(table).toBeTruthy();
  });

  it('should render table rows', async () => {
    const rows = await table.getRows();
    expect(rows).toHaveSize(testData.length);
  });

  it('should display enabled status', async () => {
    const checkboxes = await table.getAllHarnesses(
      MatCheckboxHarness.with({ selector: '.enabled' }),
    );
    const checked = await Promise.all(
      checkboxes.map((checkbox) => checkbox.isChecked()),
    );
    expect(checked).toEqual(testData.map((data) => data.enabled));
  });

  it('should display appliance names', async () => {
    const cellText = await table.getCellTextByColumnName();
    expect(cellText['name'].text).toEqual(testData.map((data) => data.name));
  });

  it('should navigate to new appliance', async () => {
    const newButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '#new-button' }),
    );
    await newButton.click();
    expect(harness.routeNativeElement?.innerHTML).toContain(
      'new-appliance-component',
    );
  });

  it('it should toggle enabled status', async () => {
    const checkboxes = await table.getAllHarnesses(
      MatCheckboxHarness.with({ selector: '.enabled' }),
    );
    const checkbox = checkboxes[0];
    const oldValue = await checkbox.isChecked();

    await checkbox.toggle();

    expect(mockService.updateAppliance)
      .withContext('save new value')
      .toHaveBeenCalledWith(testData[0].id, { enabled: !oldValue });

    await expectAsync(checkbox.isChecked())
      .withContext('display new value')
      .toBeResolvedTo(!oldValue);
  });

  it('should navigate to appliance edit', async () => {
    const { id, name } = testData[0];

    const button = await table.getHarness(
      MatButtonHarness.with({ text: name }),
    );

    await button.click();

    expect(harness.routeNativeElement?.innerHTML).toContain(
      'appliance-edit-component',
    );
    expect(harness.routeNativeElement?.innerHTML).toContain(id);
  });

  it('should navigate to localized names', async () => {
    const id = testData[0].id;

    const button = await table.getHarness(
      MatButtonHarness.with({ selector: '.localized-names' }),
    );

    await button.click();

    expect(harness.routeNativeElement?.innerHTML).toContain(
      'localized-names-component',
    );
    expect(harness.routeNativeElement?.innerHTML).toContain(id);
  });

  it('should delete appliance', async () => {
    const { name, id } = testData[0];

    const button = await table.getHarness(
      MatButtonHarness.with({ selector: '.delete' }),
    );

    await button.click();

    const rows = await table.getCellTextByColumnName();
    expect(rows['name'].text).not.toContain(name);
    expect(mockService.deleteAppliance).toHaveBeenCalledWith(id);
  });
});
