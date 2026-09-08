import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from './shared/header/header.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { QuizComponent } from './quiz/quiz.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, SideMenuComponent,QuizComponent],
  imports: [CommonModule, PagesRoutingModule,ReactiveFormsModule, MatToolbarModule],
  exports: [HeaderComponent, SideMenuComponent],
})
export class PagesModule {}
