import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpDataComponent } from './np-data.component';


describe('NpDataComponent', () => {
  let component: NpDataComponent;
  let fixture: ComponentFixture<NpDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpDataComponent],
      providers: [
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NpDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
