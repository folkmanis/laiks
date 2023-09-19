import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'laiks-price-time',
    templateUrl: './price-time.component.html',
    styleUrls: ['./price-time.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DatePipe]
})
export class PriceTimeComponent {

  @Input() time?: Date;

}
