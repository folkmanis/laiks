import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginResponse, LoginResponseType, LoginService } from '@shared/users';
import { MatButtonModule } from '@angular/material/button';
import {
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'laiks-login',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private snack = inject(MatSnackBar);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private redirect =
    inject(ActivatedRoute).snapshot.queryParamMap.get('redirect');

  private loginSubscriber = {
    error: (err: any) => {
      this.snack.open(`Neizdevās pieslēgties. ${err}`, 'OK');
      this.loginService.logout();
    },
    next: (resp: LoginResponse) => {
      if (resp.type === LoginResponseType.CREATED) {
        this.snack.open(
          `Izveidots jauns lietotājs ${resp.laiksUser.email}`,
          'OK'
        );
        this.router.navigate(['/', 'user-settings']);
        return;
      }
      if (resp.type === LoginResponseType.EXISTING) {
        this.snack.open(`Pieslēgšanās veiksmīga`, 'OK', { duration: 5000 });
      }
      this.router.navigateByUrl(this.redirect ?? '/');
    },
  };

  loginGroup = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onLoginWithGmail() {
    this.loginService.loginWithGmail().subscribe(this.loginSubscriber);
  }

  onLoginWithEmail(event: SubmitEvent) {
    event.preventDefault();
    const { email, password } = this.loginGroup.getRawValue();
    this.loginService.loginWithEmail(email, password).subscribe({
      error: (err) => {
        this.snack.open(`Pieslēgšanās neveiksmīga. ${err.message}`, 'OK');
        this.loginGroup.controls.password.reset();
      },
      next: () => {
        this.snack.open(`Pieslēgšanās veiksmīga`, 'OK', { duration: 5000 });
        this.router.navigateByUrl(this.redirect ?? '/');
      },
    });
  }
}
