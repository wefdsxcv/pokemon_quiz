import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly user$: Observable<User | null> = this.authService.user$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/home']);
  }
}
