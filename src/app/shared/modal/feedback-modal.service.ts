import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { FeedbackModalComponent } from './feedback-modal.component';
import { QuizQuestionType } from '../quiz-settings.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackModalService {
  constructor(private readonly modalService: NgbModal) {}

  open(
    isCorrect: boolean,
    correctAnswer = '',
    questionType: QuizQuestionType = 'name',
  ): NgbModalRef {
    const modalRef = this.modalService.open(FeedbackModalComponent, {
      centered: true,
      backdrop: true,
    });

    modalRef.componentInstance.isCorrect = isCorrect;
    modalRef.componentInstance.correctAnswer = correctAnswer;
    modalRef.componentInstance.questionType = questionType;

    return modalRef;
  }
}
