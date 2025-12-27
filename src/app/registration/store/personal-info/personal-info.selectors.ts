import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PersonalInfoState } from './personal-info.state';

export const selectPersonalInfo =
  createFeatureSelector<PersonalInfoState>('personalInfo');

export const selectField =
  (field: string) =>
    createSelector(selectPersonalInfo, s => s[field as 'firstName' | 'lastName' | 'email' | 'phone' | 'dob' | 'gender' | 'bio']);

export const selectAvatar = createSelector(selectPersonalInfo, s => s.avatar);

export const selectError =
  (field: string) =>
    createSelector(selectPersonalInfo, s => s.errors[field]);

export const selectTouched =
  (field: string) =>
    createSelector(selectPersonalInfo, s => s.touched[field] || false);
