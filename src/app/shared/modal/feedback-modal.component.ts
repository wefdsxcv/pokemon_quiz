import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizQuestionType } from '../quiz-settings.service';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent {
  @Input() isCorrect = false;
  @Input() correctAnswer = '';
  @Input() questionType: QuizQuestionType = 'name';

  constructor(public readonly activeModal: NgbActiveModal) {}
}
