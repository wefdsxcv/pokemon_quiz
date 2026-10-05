import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { UserProfileService } from '../../shared/user-profile.service';
import {
  RegisterModel,
  SchoolType,
} from './register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  message = '';
  isLoading = false;

  readonly registerForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    schoolType: 'other' as SchoolType,
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly userProfileService: UserProfileService,
    private readonly router: Router,
  ) {}

  selectSchoolType(schoolType: SchoolType): void {
    this.registerForm.controls.schoolType.setValue(schoolType);
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerModel: RegisterModel =
      this.registerForm.getRawValue();
    const email = registerModel.email.trim();

    if (!this.isEmailFormatValid(email)) {
      this.registerForm.controls.email.setErrors({ email: true });
      this.registerForm.controls.email.markAsTouched();
      this.message =
        'メールアドレスを正しい形式で入力してください。';
      return;
    }

    this.isLoading = true;
    this.message = '';

    let credential;

    try {
      credential = await this.authService.register(
        email,
        registerModel.password,
      );
    } catch (error) {
      console.error('[Register] Authentication registration failed.', error);
      const authError = error as { code?: string };

      this.message =
        authError.code === 'auth/invalid-email'
          ? 'メールアドレスを正しい形式で入力してください。'
          : 'アカウント登録に失敗しました。入力内容を確認してください。';
      this.isLoading = false;
      return;
    }

    try {
      await this.userProfileService.saveProfile(
        credential.user,
        registerModel.schoolType,
      );
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('[Register] Firestore profile save failed.', error);
      const firestoreError = error as { code?: string };

      this.message =
        firestoreError.code === 'permission-denied'
          ? 'アカウントは作成されましたが、プロフィール保存が拒否されました。Firestoreのルールを確認してください。'
          : firestoreError.code === 'failed-precondition'
            ? 'Firestoreデータベースが準備できていません。Firebaseコンソールの設定を確認してください。'
            : 'アカウントは作成されましたが、プロフィール保存に失敗しました。';
    } finally {
      this.isLoading = false;
    }
  }

  private isEmailFormatValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
