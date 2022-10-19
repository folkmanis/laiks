import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

import { SelectorComponent } from './selector.component';

import { SharedModule } from '../lib/shared.module';

describe('SelectorComponent', () => {
  let component: SelectorComponent;
  let fixture: ComponentFixture<SelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectorComponent],
      imports: [SharedModule],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectorComponent);
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

  it('should initialy contain number in value', () => {
    const value = component.value;
    expect(typeof value).toBe('number');
  });

  it('should cast to number', () => {
    const value = '-2';
    expect(typeof component.value).toBe('number');
  });

  it('should display initial value', () => {
    const numberBlock = fixture.nativeElement.querySelector('div.number') as HTMLDivElement;
    expect(numberBlock.textContent).toContain(component.value);
  });

  it('should add value on plus button press', () => {
    const button = fixture.nativeElement.querySelector('button#add') as HTMLButtonElement;
    const oldValue = component.value;
    button.dispatchEvent(new Event('click'));
    expect(component.value).toBe(oldValue + 1);
  });

  it('should subtract value on minus button press', () => {
    const button = fixture.nativeElement.querySelector('button#remove') as HTMLButtonElement;
    const oldValue = component.value;
    button.dispatchEvent(new Event('click'));
    expect(component.value).toBe(oldValue - 1);
  });

  it('should emit value on button press', () => {
    const button = fixture.nativeElement.querySelector('button#add') as HTMLButtonElement;
    component.valueChanges.subscribe(val => {
      expect(val).toBe(component.value);
    });
    button.dispatchEvent(new Event('click'));
  });

  it('should display updated value', () => {
    const button = fixture.nativeElement.querySelector('button#add') as HTMLButtonElement;
    const oldValue = component.value;
    button.dispatchEvent(new Event('click'));
    button.dispatchEvent(new Event('click'));
    const { textContent } = fixture.nativeElement.querySelector('div.number') as HTMLDivElement;
    expect(Number.parseFloat(textContent!)).toBe(oldValue + 2);
  });

});
