import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService, Pokemon } from '../../shared/data.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  readonly question = 'Q1. このポケモンの なまえ は？';

  readonly answers = ['ラフレシア', 'ナッシー', 'ディグダ', 'トサキント'];

  pokemonList: Pokemon[] = [];

  readonly quizForm = this.formBuilder.nonNullable.group({
    types: 'くさ、どく',
    evolution: 'しない',
    ability: 'ようりょくそ',
    hiddenAbility: 'ほうし',
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.dataService.getPokemonList().subscribe((data) => {
      this.pokemonList = data;
    });
  }
}
