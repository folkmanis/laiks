import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketZonesListComponent } from './market-zones-list.component';

describe('MarketZonesListComponent', () => {
  let component: MarketZonesListComponent;
  let fixture: ComponentFixture<MarketZonesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarketZonesListComponent]
    });
    fixture = TestBed.createComponent(MarketZonesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
