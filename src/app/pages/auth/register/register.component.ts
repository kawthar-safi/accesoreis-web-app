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
  showPassword = false;
  showConfirmPassword = false;
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const newUser = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: formValue.name!,
      email: formValue.email!,
      password: formValue.password!,
      usertype: 'customer',
      phone: formValue.phone!,
      address: formValue.address!,
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Email already exists');
        // this.showError();
      },
    });
    //   showError() {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: this.i18nService.t('messageServicetranslate.error'),
    //     detail: this.i18nService.t('messageServicetranslate.emialexist'),
    //   });
    // }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
export function passwordMatchValidator(
  form: AbstractControl
): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
