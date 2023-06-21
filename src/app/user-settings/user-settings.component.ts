import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { PermissionsService } from 'src/app/shared/permissions.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'laiks-user-settings',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsComponent {

  private userService = inject(UserService);

  laiksUser$ = this.userService.laiksUser();

  npAllowed = toSignal(inject(PermissionsService).isNpAllowed(), { initialValue: false });
}
