import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { LoginService } from '@shared/users';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface NewUser {
  email: string;
  password: string;
  passwordRepeat: string;
  name: string;
}

type NewUserForm = {
  [key in keyof NewUser]: FormControl<NewUser[key]>;
};

const passwordsMatchValidator: ValidatorFn = (
  group: AbstractControl<NewUserForm>
) => {
  if (group.value.password !== group.value.passwordRepeat) {
    group.get('passwordRepeat')?.setErrors({ passwordsDontMatch: true });
    return { passwordsDontMatch: true };
  } else {
    return null;
  }
};

@Component({
  selector: 'laiks-create-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent {
  private nnfb = inject(NonNullableFormBuilder);
  private loginService = inject(LoginService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  newUserForm: FormGroup<NewUserForm> = this.nnfb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: [''],
      name: ['', [Validators.required]],
    },
    {
      validators: [passwordsMatchValidator],
    }
  );

  onCreateUser(event: SubmitEvent) {
    event.preventDefault();
    const { email, password, name } = this.newUserForm.getRawValue();
    this.loginService.createEmailAccount(email, password, name).subscribe({
      error: (err) =>
        this.snack.open(`Neizdevās pievienot. ${err.message}`, 'OK'),
      next: () => {
        this.router.navigate(['/', 'user-settings']);
      },
    });
  }
}
