import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { I18nService } from '../../../service/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-register',
  imports: [TranslatePipe, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  // private messageService = inject(MessageService);
  public i18nService = inject(I18nService);
  private router = inject(Router);

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  onSubmit() {
    // if (this.form.valid) {
    //   this.authService.signUpCustomer(this.form.value).subscribe({
    //     next: () => {
    //       this.form.reset();
    //       this.router.navigate(['/signin']);
    //     },
    //     // error: () => {
    //     //   this.showError();
    //     // },
    //   });
    // }
  }

  // togglePasswordVisibility() {
  //   this.showPassword = !this.showPassword;
  // }

  // toggleConfirmPasswordVisibility() {
  //   this.showConfirmPassword = !this.showConfirmPassword;
  // }

  // showError() {
  //   this.messageService.add({
  //     severity: 'error',
  //     summary: this.i18nService.t('messageServicetranslate.error'),
  //     detail: this.i18nService.t('messageServicetranslate.emialexist'),
  //   });
  // }
}
export function passwordMatchValidator(
  form: AbstractControl
): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
