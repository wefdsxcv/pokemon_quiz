import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QuizRoutingModule,
  ],
})
export class QuizModule {}
