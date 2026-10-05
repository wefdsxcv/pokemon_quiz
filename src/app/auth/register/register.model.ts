export type SchoolType =
  | 'elementary'
  | 'juniorHigh'
  | 'highSchool'
  | 'other';

export interface RegisterModel {
  email: string;
  password: string;
  schoolType: SchoolType;
}
