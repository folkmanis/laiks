import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliancesListComponent } from './appliances-list.component';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';


class TestPowerAppliancesService {
  getPowerAppliances() {
    return of([]);
  }
  updateAppliance() {
    //
  }
}

describe('AppliancesListComponent', () => {
  let component: AppliancesListComponent;
  let fixture: ComponentFixture<AppliancesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppliancesListComponent],
      providers: [
        { provide: PowerAppliancesService, useClass: TestPowerAppliancesService },
        provideRouter([{ path: 'appliances', component: AppliancesListComponent }])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppliancesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
