import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { PermissionsService } from 'src/app/shared/permissions.service';

@Component({
  selector: 'laiks-user-settings',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent {
  npAllowed = toSignal(inject(PermissionsService).isNpAllowed(), { initialValue: false });
}
