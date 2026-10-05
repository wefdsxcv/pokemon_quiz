import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';
import { FeedbackModalModule } from '../../shared/modal/feedback-modal.module';

@NgModule({
  declarations: [
    QuizComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuizRoutingModule,
    FeedbackModalModule,
  ],
})
export class QuizModule {}
