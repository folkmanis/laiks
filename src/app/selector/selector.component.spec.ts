import { Component } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { SelectorComponent } from './selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NumberSignPipe } from '../shared/number-sign.pipe';


@Component({
  template: `
    <laiks-selector [value]="initialValue" (valueChange)="onValueChanges($event)">
    </laiks-selector>  `,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NumberSignPipe]
})
class SelectorTestComponent {
  initialValue: any = '2';
  updatedValue: number | undefined;
  onValueChanges(val: number) {
    this.updatedValue = val;
  }
}


describe('SelectorComponent', () => {
  let component: SelectorTestComponent;
  let fixture: ComponentFixture<SelectorTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectorComponent,
        NumberSignPipe,
        SelectorTestComponent
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectorTestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create plus button', () => {
    const button = fixture.nativeElement.querySelector('button#add');
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  it('should create minus button', () => {
    const button = fixture.nativeElement.querySelector('button#remove');
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  it('should create number block', () => {
    const numberBlock = fixture.nativeElement.querySelector('div.number') as HTMLDivElement;
    expect(numberBlock).toBeTruthy();
  });

  it('should display positive values with plus sign', () => {
    const { textContent } = fixture.nativeElement.querySelector('div.number') as HTMLDivElement;
    expect(textContent).toContain('+2');
  });

  it('should add value on plus button press', () => {
    const button = fixture.nativeElement.querySelector('button#add') as HTMLButtonElement;
    button.dispatchEvent(new Event('click'));
    const { textContent } = fixture.nativeElement.querySelector('div.number') as HTMLDivElement;
    expect(textContent).toContain('+3');
  });

  it('should subtract value on minus button press', () => {
    const button = fixture.nativeElement.querySelector('button#remove') as HTMLButtonElement;
    button.dispatchEvent(new Event('click'));
    button.dispatchEvent(new Event('click'));
    button.dispatchEvent(new Event('click'));
    const { textContent } = fixture.nativeElement.querySelector('div.number') as HTMLDivElement;
    expect(textContent).toContain('-1');
  });

  it('should change value on input change', () => {
    component.initialValue = -2;
    fixture.detectChanges();
    const { textContent } = fixture.nativeElement.querySelector('div.number') as HTMLDivElement;
    expect(textContent).toContain('-2');
  });

  it('should emit value on button press', () => {
    const button = fixture.nativeElement.querySelector('button#add') as HTMLButtonElement;
    button.dispatchEvent(new Event('click'));
    expect(component.updatedValue).toBe(3);
  });

});
