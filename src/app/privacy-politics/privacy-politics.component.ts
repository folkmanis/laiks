import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'laiks-privacy-politics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-politics.component.html',
  styleUrls: ['./privacy-politics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vertical-container',
  },
})
export class PrivacyPoliticsComponent {}
