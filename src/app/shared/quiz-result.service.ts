import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  orderBy,
  query,
} from '@angular/fire/firestore';

import { AuthService } from '../auth/auth.service';
import {
  QuizQuestionType,
  QuizRegion,
  QuizSettings,
} from './quiz-settings.service';

export interface QuizResult {
  questionCount: number;
  correctCount: number;
  bestStreak: number;
  scoreRate: number;
  region: QuizSettings['region'];
  questionType: QuizSettings['questionType'];
  createdAt: string;
}

export interface QuizResultRecord extends QuizResult {
  id: string;
}

export interface QuizAchievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface QuizGrowthRecord {
  totalCorrect: number;
  highestScoreRate: number;
  quizCount: number;
  bestRegion: QuizRegion | null;
  weakestQuestionType: QuizQuestionType | null;
}

@Injectable({
  providedIn: 'root',
})
export class QuizResultService {
  constructor(
    private readonly firestore: Firestore,
    private readonly authService: AuthService,
  ) {}

  async saveResult(
    settings: QuizSettings,
    correctCount: number,
    bestStreak: number,
  ): Promise<void> {
    const user = this.authService.currentUser;

    if (!user) {
      throw new Error('ログインが必要です。');
    }

    const result: QuizResult = {
      questionCount: settings.questionCount,
      correctCount,
      bestStreak,
      scoreRate: Math.round(
        (correctCount / settings.questionCount) * 100,
      ),
      region: settings.region,
      questionType: settings.questionType,
      createdAt: new Date().toISOString(),
    };

    await addDoc(
      collection(this.firestore, `users/${user.uid}/results`),
      result,
    );
  }

  async getResults(): Promise<QuizResultRecord[]> {
    const user = this.authService.currentUser;

    if (!user) {
      throw new Error('ログインが必要です。');
    }

    const resultsQuery = query(
      collection(this.firestore, `users/${user.uid}/results`),
      orderBy('createdAt', 'desc'),
    );
    const resultsSnapshot = await getDocs(resultsQuery);

    return resultsSnapshot.docs.map((resultDocument) => {
      const data = resultDocument.data() as QuizResult;

      return {
        id: resultDocument.id,
        ...data,
        // 以前保存した成績にはbestStreakがないため、0として扱う。
        bestStreak: data.bestStreak ?? 0,
      };
    });
  }

  getAchievements(
    results: QuizResultRecord[],
  ): QuizAchievement[] {
    const hasFiveCorrectInOneQuiz = (
      predicate: (result: QuizResultRecord) => boolean,
    ): boolean =>
      results.some(
        (result) =>
          predicate(result) &&
          result.correctCount >= 5,
      );

    const regionAchievements: Array<{
      region: Exclude<QuizRegion, 'all'>;
      label: string;
    }> = [
      { region: 'kanto', label: 'カントー' },
      { region: 'johto', label: 'ジョウト' },
      { region: 'hoenn', label: 'ホウエン' },
      { region: 'sinnoh', label: 'シンオウ' },
      { region: 'unova', label: 'イッシュ' },
      { region: 'kalos', label: 'カロス' },
      { region: 'alola', label: 'アローラ' },
      { region: 'galar', label: 'ガラル' },
      { region: 'paldea', label: 'パルデア' },
    ];

    const questionTypeAchievements: Array<{
      questionType: QuizQuestionType;
      label: string;
    }> = [
      { questionType: 'name', label: 'なまえ' },
      { questionType: 'type', label: 'たいぷ' },
      { questionType: 'ability', label: 'とくせい' },
      { questionType: 'weakness', label: 'じゃくてん' },
    ];

    return [
      {
        id: 'five-streak',
        title: '5もん れんぞくせいかい',
        description: '5もん つづけて せいかいしよう',
        completed: results.some(
          (result) => result.bestStreak >= 5,
        ),
      },
      {
        id: 'ten-streak',
        title: '10もん れんぞくせいかい',
        description: '10もん つづけて せいかいしよう',
        completed: results.some(
          (result) => result.bestStreak >= 10,
        ),
      },
      {
        id: 'fifteen-streak',
        title: '15もん れんぞくせいかい',
        description: '15もん つづけて せいかいしよう',
        completed: results.some(
          (result) => result.bestStreak >= 15,
        ),
      },
      {
        id: 'kanto-clear',
        title: 'かんとーちほう くりあ',
        description: '1かいの クイズで 5もん せいかいしよう',
        completed: hasFiveCorrectInOneQuiz(
          (result) => result.region === 'kanto',
        ),
      },
      {
        id: 'type-master',
        title: 'たいぷもんだい ますたー',
        description: '1かいの クイズで 5もん せいかいしよう',
        completed: hasFiveCorrectInOneQuiz(
          (result) => result.questionType === 'type',
        ),
      },
      ...regionAchievements
        .filter(({ region }) => region !== 'kanto')
        .map(({ region, label }) => ({
          id: `region-${region}`,
          title: `${label}ちほう くりあ`,
          description: '1かいの クイズで 5もん せいかいしよう',
          completed: hasFiveCorrectInOneQuiz(
            (result) => result.region === region,
          ),
        })),
      ...questionTypeAchievements
        .filter(({ questionType }) => questionType !== 'type')
        .map(({ questionType, label }) => ({
          id: `question-${questionType}`,
          title: `${label}もんだい ますたー`,
          description: '1かいの クイズで 5もん せいかいしよう',
          completed: hasFiveCorrectInOneQuiz(
            (result) =>
              result.questionType === questionType,
          ),
        })),
    ];
  }

  getGrowthRecord(
    results: QuizResultRecord[],
  ): QuizGrowthRecord {
    const regionTotals = new Map<
      QuizRegion,
      { correctCount: number; questionCount: number }
    >();

    const questionTypeTotals = new Map<
      QuizQuestionType,
      { correctCount: number; questionCount: number }
    >();

    for (const result of results) {
      const regionTotal = regionTotals.get(result.region) ?? {
        correctCount: 0,
        questionCount: 0,
      };

      regionTotal.correctCount += result.correctCount;
      regionTotal.questionCount += result.questionCount;
      regionTotals.set(result.region, regionTotal);

      const questionTypeTotal =
        questionTypeTotals.get(result.questionType) ?? {
          correctCount: 0,
          questionCount: 0,
        };

      questionTypeTotal.correctCount += result.correctCount;
      questionTypeTotal.questionCount += result.questionCount;
      questionTypeTotals.set(
        result.questionType,
        questionTypeTotal,
      );
    }

    const eligibleRegions = Array.from(
      regionTotals.entries(),
    ).filter(
      ([region, total]) =>
        region !== 'all' &&
        total.questionCount >= 3,
    );

    const eligibleQuestionTypes = Array.from(
      questionTypeTotals.entries(),
    ).filter(
      ([, total]) => total.questionCount >= 3,
    );

    const bestRegion = eligibleRegions.sort(
      ([, first], [, second]) =>
        second.correctCount / second.questionCount -
        first.correctCount / first.questionCount,
    )[0]?.[0] ?? null;

    const weakestQuestionType = eligibleQuestionTypes.sort(
      ([, first], [, second]) =>
        first.correctCount / first.questionCount -
        second.correctCount / second.questionCount,
    )[0]?.[0] ?? null;

    return {
      totalCorrect: results.reduce(
        (total, result) => total + result.correctCount,
        0,
      ),
      highestScoreRate: results.length
        ? Math.max(
            ...results.map((result) => result.scoreRate),
          )
        : 0,
      quizCount: results.length,
      bestRegion,
      weakestQuestionType,
    };
  }
}
