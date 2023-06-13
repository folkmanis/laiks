import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesComponent } from './prices.component';
import { of } from 'rxjs';
import { NpDataService } from '../np-data/lib/np-data.service';
import { LaiksService } from '../shared/laiks.service';
import { PowerAppliancesService } from '../np-data/lib/power-appliances.service';
import { PriceCalculatorService } from '../np-data/lib/price-calculator.service';

class TestNpDataService {
  getNpPrices() {
    return of([]);
  }
}

class TestLaiksService {
  minuteObserver() {
    return of(new Date());
  }
}

class TestPowerAppliancesService {
  getPowerAppliances() {
    return of([]);
  }
}

describe('PricesComponent', () => {
  let component: PricesComponent;
  let fixture: ComponentFixture<PricesComponent>;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [PricesComponent],
      providers: [
        { provide: NpDataService, useClass: TestNpDataService },
        { provide: LaiksService, useClass: TestLaiksService },
        { provide: PowerAppliancesService, useClass: TestPowerAppliancesService },
      ]
    })
      .createComponent(PricesComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
