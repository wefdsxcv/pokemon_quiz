import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import {
  QuizQuestionType,
  QuizRegion,
  QuizSettings,
  QuizSettingsService,
} from '../../shared/quiz-settings.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  message = '';

  isLoading = true;

  readonly settingForm = this.formBuilder.nonNullable.group({
    region: 'kanto' as QuizRegion,
    questionType: 'name' as QuizQuestionType,
    questionCount: 10,
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly settingsService: QuizSettingsService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.settingForm.patchValue(
        await this.settingsService.getSettings(),
      );
    } catch {
      this.message =
        '設定の読み込みに失敗しました。時間をおいて再度お試しください。';
    } finally {
      this.isLoading = false;
    }
  }

  async startQuiz(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    const settings: QuizSettings = this.settingForm.getRawValue();
    this.isLoading = true;
    this.message = '';

    try {
      await this.settingsService.saveSettings(settings);
      await this.router.navigate(['/quiz']);
    } catch {
      this.message =
        '設定の保存に失敗しました。Firestoreのルールを確認してください。';
      this.isLoading = false;
    }
  }
}
