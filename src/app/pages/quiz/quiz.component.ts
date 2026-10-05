import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService, Pokemon } from '../../shared/data.service';
import { FeedbackModalService } from '../../shared/modal/feedback-modal.service';
import { QuizResultService } from '../../shared/quiz-result.service';
import {
  QuizSettings,
  QuizSettingsService,
} from '../../shared/quiz-settings.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  question = 'Q1. このポケモンの なまえ は？';

  answers: string[] = [];

  answerColorClasses: string[] = [];

  correctAnswer = '';

  currentPokemon: Pokemon | null = null;

  pokemonList: Pokemon[] = [];

  settings: QuizSettings = {
    region: 'kanto',
    questionType: 'name',
    questionCount: 10,
  };

  questionNumber = 0;

  correctCount = 0;

  currentStreak = 0;

  bestStreak = 0;

  isFinished = false;

  isLoading = true;

  resultMessage = '';

  readonly quizForm = this.formBuilder.nonNullable.group({
    name: 'ピカチュウ',
    types: 'くさ、どく',
    evolution: 'しない',
    ability: 'ようりょくそ',
    hiddenAbility: 'ほうし',
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dataService: DataService,
    private readonly feedbackModalService: FeedbackModalService,
    private readonly quizResultService: QuizResultService,
    private readonly settingsService: QuizSettingsService,
  ) {}

  ngOnInit(): void {
    this.dataService.getPokemonList().subscribe(async (data) => {
      this.pokemonList = data;
      await this.startQuiz();
    });
  }

  async startQuiz(): Promise<void> {
    this.settings = await this.settingsService.getSettings();
    this.questionNumber = 0;
    this.correctCount = 0;
    this.currentStreak = 0;
    this.bestStreak = 0;
    this.isFinished = false;
    this.isLoading = true;
    this.createQuestion();
  }

  private createQuestion(): void {
    const availablePokemon = this.getAvailablePokemon();
    const shuffledPokemon = this.shuffle(availablePokemon);
    const questionPokemon = shuffledPokemon[0];
    const correctAnswer = this.getAnswer(questionPokemon);
    const dummyAnswers = this.shuffle(
      shuffledPokemon
        .slice(1)
        .map((pokemon) => this.getAnswer(pokemon))
        .filter(
          (answer, index, answers) =>
            answer !== correctAnswer && answers.indexOf(answer) === index,
        ),
    ).slice(0, 3);

    this.questionNumber += 1;
    this.question = this.getQuestionText();
    this.currentPokemon = questionPokemon;
    this.correctAnswer = correctAnswer;
    this.answers = this.shuffle([
      this.correctAnswer,
      ...dummyAnswers,
    ]);
    this.answerColorClasses = this.answers.map((answer) =>
      this.getAnswerColorClass(answer),
    );

    this.quizForm.patchValue({
      name: questionPokemon.name,
      types: questionPokemon.types.join('、'),
      evolution: questionPokemon.evolutions.length > 0
        ? questionPokemon.evolutions.join('、')
        : 'しない',
      ability: questionPokemon.abilities.join('、'),
      hiddenAbility: questionPokemon.hiddenAbilities.join('、'),
    });

    this.isLoading = false;
  }

  private getAvailablePokemon(): Pokemon[] {
    if (this.settings.region === 'all') {
      return this.pokemonList;
    }

    const filteredPokemon = this.pokemonList.filter(
      (pokemon) => pokemon.region === this.settings.region,
    );

    // 4択を作るため、対象地方のデータが4匹未満の場合は全データを使う。
    return filteredPokemon.length >= 4 ? filteredPokemon : this.pokemonList;
  }

  private getAnswer(pokemon: Pokemon): string {
    switch (this.settings.questionType) {
      case 'type':
        return pokemon.types.join('、');
      case 'ability':
        return pokemon.abilities.join('、');
      case 'weakness':
        return pokemon.weaknesses.join('、');
      case 'name':
      default:
        return pokemon.name;
    }
  }

  private getQuestionText(): string {
    const questionLabel = this.getQuestionLabel();

    return `Q${this.questionNumber}. このポケモンの ${questionLabel} は？`;
  }

  private getQuestionLabel(): string {
    switch (this.settings.questionType) {
      case 'type':
        return 'タイプ';
      case 'ability':
        return 'とくせい';
      case 'weakness':
        return 'じゃくてん';
      case 'name':
      default:
        return 'なまえ';
    }
  }

  getQuestionDetailLabel(): string {
    switch (this.settings.questionType) {
      case 'type':
        return 'なまえ';
      case 'ability':
      case 'weakness':
      case 'name':
      default:
        return 'タイプ';
    }
  }

  getRegionNotice(): string {
    if (this.settings.region === 'all') {
      return '';
    }

    const regionCount = this.pokemonList.filter(
      (pokemon) => pokemon.region === this.settings.region,
    ).length;

    return regionCount < 4
      ? 'この地方の ポケモンが まだ すくないので、すべての ポケモンから だすよ。'
      : '';
  }

  private getAnswerColorClass(answer: string): string {
    const matchedPokemon = this.getAvailablePokemon().find(
      (pokemon) => this.getAnswer(pokemon) === answer,
    );
    const type = this.settings.questionType === 'weakness'
      ? answer.split('、')[0]
      : matchedPokemon?.types[0] ?? answer.split('、')[0];
    const colorNames: Record<string, string> = {
      'ノーマル': 'normal',
      'ほのお': 'fire',
      'みず': 'water',
      'でんき': 'electric',
      'くさ': 'grass',
      'こおり': 'ice',
      'かくとう': 'fighting',
      'どく': 'poison',
      'じめん': 'ground',
      'ひこう': 'flying',
      'エスパー': 'psychic',
      'むし': 'bug',
      'いわ': 'rock',
      'ゴースト': 'ghost',
      'ドラゴン': 'dragon',
      'あく': 'dark',
      'はがね': 'steel',
      'フェアリー': 'fairy',
    };

    return `type-${colorNames[type] ?? 'normal'}`;
  }

  private shuffle<T>(items: T[]): T[] {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledItems[index], shuffledItems[randomIndex]] = [
        shuffledItems[randomIndex],
        shuffledItems[index],
      ];
    }

    return shuffledItems;
  }

  register(answer: string): void {
    this.isLoading = true;

    if (answer === this.correctAnswer) {
      this.correctCount += 1;
      this.currentStreak += 1;
      this.bestStreak = Math.max(
        this.bestStreak,
        this.currentStreak,
      );
    } else {
      this.currentStreak = 0;
    }

    const isCorrect = answer === this.correctAnswer;
    const modalRef = this.feedbackModalService.open(
      isCorrect,
      this.correctAnswer,
      this.settings.questionType,
    );

    modalRef.result.then(
      () => this.finishAnswer(),
      () => this.finishAnswer(),
    );
  }

  private async finishAnswer(): Promise<void> {
    if (this.questionNumber >= this.settings.questionCount) {
      try {
        await this.quizResultService.saveResult(
          this.settings,
          this.correctCount,
          this.bestStreak,
        );
        this.resultMessage = '';
      } catch (error) {
        console.error('[Quiz] Result save failed.', error);
        this.resultMessage =
          '結果は表示できますが、成績の保存に失敗しました。';
      }

      this.isFinished = true;
      this.isLoading = false;
      return;
    }

    this.createQuestion();
  }
}
