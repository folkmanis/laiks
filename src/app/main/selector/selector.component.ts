import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NumberSignPipe } from '@shared/utils';

@Component({
    selector: 'laiks-selector',
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule, NumberSignPipe]
})
export class SelectorComponent {
  value = model(0);

  onButtonPress(val: number): void {
    this.value.set(this.value() + val);
  }
}
