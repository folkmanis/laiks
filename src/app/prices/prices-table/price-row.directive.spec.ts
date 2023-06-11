import { Component, DebugElement, Input } from '@angular/core';
import { PriceRowDirective } from './price-row.directive';
import { NpPriceOffset } from 'src/app/np-data/lib/np-price.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <table>
      <tr [laiksPriceRow]="value"><td>Test data</td></tr>
    </table>
  `,
  standalone: true,
  imports: [PriceRowDirective]
})
export class TestComponent {
  @Input() value: NpPriceOffset | undefined;
}


describe('PriceRowDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dir: DebugElement;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent, PriceRowDirective]
    })
      .createComponent(TestComponent);

    fixture.detectChanges();

    component = fixture.componentInstance;
    dir = fixture.debugElement.query(By.directive(PriceRowDirective));
  });


  it('should create an instance', () => {
    expect(dir).toBeTruthy();
  });
});
