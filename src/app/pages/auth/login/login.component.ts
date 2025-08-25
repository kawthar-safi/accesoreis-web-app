import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  //private messageService = inject(MessageService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  showPassword = false;

  onLogin() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    if (!email || !password) return;
    this.authService.login(email, password).subscribe({
      next: (Users) => {
        switch (Users.usertype) {
          case 'client':
            this.router.navigate(['/']);
            break;
          case 'customer':
            this.router.navigate(['/']);
            break;

          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: () => {
        alert('Invalid email or password');
      },

      // error: () =>
      //   this.messageService.add({
      //     severity: 'error',
      //     summary: 'error!',
      //     detail: 'Invalid email or password',
      //   }),
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
