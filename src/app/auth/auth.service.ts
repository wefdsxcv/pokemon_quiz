import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import {
  Auth as FirebaseAuth,
  User,
  UserCredential,
} from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$: Observable<User | null>;

  constructor(private readonly auth: Auth) {
    this.user$ = authState(this.firebaseAuth);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    );
  }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    );
  }

  logout(): Promise<void> {
    return signOut(this.firebaseAuth);
  }

  get currentUser(): User | null {
    return this.firebaseAuth.currentUser;
  }

  private get firebaseAuth(): FirebaseAuth {
    return this.auth as unknown as FirebaseAuth;
  }
}
