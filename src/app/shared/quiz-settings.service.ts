import { Injectable } from '@angular/core';
import {
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';

import { AuthService } from '../auth/auth.service';

export type QuizRegion =
  | 'kanto'
  | 'johto'
  | 'hoenn'
  | 'sinnoh'
  | 'unova'
  | 'kalos'
  | 'alola'
  | 'galar'
  | 'paldea'
  | 'all';
export type QuizQuestionType =
  | 'name'
  | 'type'
  | 'ability'
  | 'weakness';

export interface QuizSettings {
  region: QuizRegion;
  questionType: QuizQuestionType;
  questionCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class QuizSettingsService {
  private readonly storageKey = 'pokemon-quiz-settings';
  private readonly configuredKey = 'pokemon-quiz-configured';
  private readonly settingsPath = 'settings/current';

  private readonly defaultSettings: QuizSettings = {
    region: 'kanto',
    questionType: 'name',
    questionCount: 10,
  };

  constructor(
    private readonly firestore: Firestore,
    private readonly authService: AuthService,
  ) {}

  async getSettings(): Promise<QuizSettings> {
    const user = this.authService.currentUser;

    if (!user) {
      return { ...this.defaultSettings };
    }

    const settingsSnapshot = await getDoc(
      this.getSettingsReference(user.uid),
    );

    if (settingsSnapshot.exists()) {
      return this.normalizeSettings(settingsSnapshot.data());
    }

    const localSettings = this.getLocalSettings();

    if (localSettings) {
      await this.saveSettings(localSettings);
      return localSettings;
    }

    return { ...this.defaultSettings };
  }

  async saveSettings(settings: QuizSettings): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      throw new Error('ログインが必要です。');
    }

    const normalizedSettings = this.normalizeSettings(settings);

    await setDoc(
      this.getSettingsReference(user.uid),
      {
        ...normalizedSettings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.configuredKey);
  }

  async hasConfigured(): Promise<boolean> {
    const user = this.authService.currentUser;

    if (!user) {
      return false;
    }

    const settingsSnapshot = await getDoc(
      this.getSettingsReference(user.uid),
    );

    if (settingsSnapshot.exists()) {
      return true;
    }

    const localSettings = this.getLocalSettings();

    if (!localSettings) {
      return false;
    }

    try {
      await this.saveSettings(localSettings);
      return true;
    } catch {
      return false;
    }
  }

  private getSettingsReference(userId: string) {
    return doc(
      this.firestore,
      `users/${userId}/${this.settingsPath}`,
    );
  }

  private getLocalSettings(): QuizSettings | null {
    const savedSettings = localStorage.getItem(this.storageKey);

    if (!savedSettings) {
      return null;
    }

    try {
      return this.normalizeSettings(
        JSON.parse(savedSettings) as Partial<QuizSettings>,
      );
    } catch {
      return null;
    }
  }

  private normalizeSettings(
    settings: Partial<QuizSettings>,
  ): QuizSettings {
    return {
      region: this.isSupportedRegion(settings.region)
        ? settings.region
        : 'kanto',
      questionType: this.isSupportedQuestionType(
        settings.questionType,
      )
        ? settings.questionType
        : 'name',
      questionCount: this.isSupportedQuestionCount(
        settings.questionCount,
      )
        ? settings.questionCount
        : this.defaultSettings.questionCount,
    };
  }

  private isSupportedRegion(
    region: QuizRegion | undefined,
  ): region is QuizRegion {
    return [
      'kanto',
      'johto',
      'hoenn',
      'sinnoh',
      'unova',
      'kalos',
      'alola',
      'galar',
      'paldea',
      'all',
    ].includes(region as QuizRegion);
  }

  private isSupportedQuestionType(
    questionType: QuizQuestionType | undefined,
  ): questionType is QuizQuestionType {
    return [
      'name',
      'type',
      'ability',
      'weakness',
    ].includes(questionType as QuizQuestionType);
  }

  private isSupportedQuestionCount(
    questionCount: number | undefined,
  ): questionCount is number {
    return [5, 10, 15].includes(Number(questionCount));
  }
}
