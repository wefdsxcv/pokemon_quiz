import { Injectable } from '@angular/core';
import {
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { User } from 'firebase/auth';

import { SchoolType } from '../auth/register/register.model';

export interface UserProfile {
  email: string;
  schoolType: SchoolType;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private readonly firestore: Firestore) {}

  saveProfile(user: User, schoolType: SchoolType): Promise<void> {
    const profileReference = doc(
      this.firestore,
      `users/${user.uid}`,
    );

    const profile: UserProfile = {
      email: user.email ?? '',
      schoolType,
      createdAt: new Date().toISOString(),
    };

    return setDoc(profileReference, profile, { merge: true });
  }
}
