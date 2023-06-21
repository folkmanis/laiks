import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketZoneEditComponent } from './market-zone-edit.component';

describe('MarketZoneEditComponent', () => {
  let component: MarketZoneEditComponent;
  let fixture: ComponentFixture<MarketZoneEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarketZoneEditComponent]
    });
    fixture = TestBed.createComponent(MarketZoneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
