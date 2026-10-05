import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly user$: Observable<User | null> = this.authService.user$;

  constructor(private readonly authService: AuthService) {}
}
