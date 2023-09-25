import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'laiks-color-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-tag.component.html',
  styleUrls: ['./color-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorTagComponent {
  @Input() color?: string | null;
}
