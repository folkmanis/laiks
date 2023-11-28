import { ComponentFixture, TestBed } from '@angular/core/testing';

import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { SystemPricesComponent } from './system-prices.component';

describe('SystemPricesComponent', () => {
  let component: SystemPricesComponent;
  let fixture: ComponentFixture<SystemPricesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SystemPricesComponent],
      providers: [testFirebaseProvider],
    });
    fixture = TestBed.createComponent(SystemPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
