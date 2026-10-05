import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { QuizSettingsService } from './quiz-settings.service';

@Injectable({
  providedIn: 'root',
})
export class QuizSettingsGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly settingsService: QuizSettingsService,
  ) {}

  async canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    return (await this.settingsService.hasConfigured())
      ? true
      : this.router.createUrlTree(['/setting']);
  }
}
