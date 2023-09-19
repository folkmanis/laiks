import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NumberSignPipe } from '@shared';

@Component({
  selector: 'laiks-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NumberSignPipe],
})
export class SelectorComponent {
  @Input()
  value: number = 0;

  @Output()
  valueChange = new EventEmitter<number>();

  onButtonPress(val: number): void {
    this.value += val;
    this.valueChange.next(this.value);
  }
}
