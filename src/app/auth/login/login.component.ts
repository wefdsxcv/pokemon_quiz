import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { LoginModel } from './login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  message = '';
  isLoading = false;

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginModel: LoginModel = this.loginForm.getRawValue();
    const email = loginModel.email.trim();

    if (!this.isEmailFormatValid(email)) {
      this.loginForm.controls.email.setErrors({ email: true });
      this.loginForm.controls.email.markAsTouched();
      this.message =
        'メールアドレスを正しい形式で入力してください。';
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      await this.authService.login(
        email,
        loginModel.password,
      );

      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl');
      const destination =
        returnUrl && returnUrl.startsWith('/') ? returnUrl : '/quiz';

      await this.router.navigateByUrl(destination);
    } catch {
      this.message =
        'ログインに失敗しました。メールアドレスとパスワードを確認してください。';
    } finally {
      this.isLoading = false;
    }
  }

  private isEmailFormatValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
