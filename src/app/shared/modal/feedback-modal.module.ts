import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeedbackModalComponent } from './feedback-modal.component';

@NgModule({
  declarations: [FeedbackModalComponent],
  imports: [
    CommonModule,
    NgbModule,
  ],
  exports: [FeedbackModalComponent],
})
export class FeedbackModalModule {}
