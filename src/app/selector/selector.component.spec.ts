import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { NumberSignPipe } from '../shared/number-sign.pipe';
import { SelectorComponent } from './selector.component';



describe('SelectorComponent', () => {
  let component: SelectorComponent;
  let fixture: ComponentFixture<SelectorComponent>;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [
        // SelectorComponent,
        SelectorComponent,
        NumberSignPipe,
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ]
    })
      .createComponent(SelectorComponent);
    component = fixture.componentInstance;
    component.value = 2;
    fixture.detectChanges();
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

});
