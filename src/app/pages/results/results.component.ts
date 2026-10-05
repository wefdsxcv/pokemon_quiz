import { Component, OnInit } from '@angular/core';

import {
  QuizAchievement,
  QuizGrowthRecord,
  QuizResultRecord,
  QuizResultService,
} from '../../shared/quiz-result.service';
import {
  QuizQuestionType,
  QuizRegion,
} from '../../shared/quiz-settings.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  results: QuizResultRecord[] = [];

  achievements: QuizAchievement[] = [];

  growthRecord: QuizGrowthRecord = {
    totalCorrect: 0,
    highestScoreRate: 0,
    quizCount: 0,
    bestRegion: null,
    weakestQuestionType: null,
  };

  isLoading = true;

  message = '';

  getRegionLabel(region: QuizRegion): string {
    const labels: Record<QuizRegion, string> = {
      kanto: 'カントー',
      johto: 'ジョウト',
      hoenn: 'ホウエン',
      sinnoh: 'シンオウ',
      unova: 'イッシュ',
      kalos: 'カロス',
      alola: 'アローラ',
      galar: 'ガラル',
      paldea: 'パルデア',
      all: 'すべて',
    };

    return labels[region];
  }

  getQuestionTypeLabel(questionType: QuizQuestionType): string {
    const labels: Record<QuizQuestionType, string> = {
      name: 'なまえ',
      type: 'タイプ',
      ability: 'とくせい',
      weakness: 'じゃくてん',
    };

    return labels[questionType];
  }

  constructor(
    private readonly quizResultService: QuizResultService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.results = await this.quizResultService.getResults();
      this.achievements =
        this.quizResultService.getAchievements(this.results);
      this.growthRecord =
        this.quizResultService.getGrowthRecord(this.results);
    } catch {
      this.message =
        '成績の読み込みに失敗しました。Firestoreのルールを確認してください。';
    } finally {
      this.isLoading = false;
    }
  }
}
