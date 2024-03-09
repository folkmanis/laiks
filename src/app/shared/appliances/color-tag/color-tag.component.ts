import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'laiks-color-tag',
  standalone: true,
  templateUrl: './color-tag.component.html',
  styleUrls: ['./color-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorTagComponent {
  color = input<string | null>(null);
}
