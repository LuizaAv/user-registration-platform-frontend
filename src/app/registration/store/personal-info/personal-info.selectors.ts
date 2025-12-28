import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PersonalInfoState } from './personal-info.state';

export const selectPersonalInfo = createFeatureSelector<PersonalInfoState>('personalInfo');

export const selectField = (field: string) =>
  createSelector(
    selectPersonalInfo,
    (s) => s[field as 'firstName' | 'lastName' | 'email' | 'phone' | 'dob' | 'gender' | 'bio'],
  );

export const selectAvatar = createSelector(selectPersonalInfo, (s) => s.avatar);

export const selectError = (field: string) =>
  createSelector(selectPersonalInfo, (s) => s.errors[field]);

export const selectTouched = (field: string) =>
  createSelector(selectPersonalInfo, (s) => s.touched[field] || false);

export const selectPersonalInfoComplete = createSelector(selectPersonalInfo, (state) => {
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'dob', 'gender'];
  const hasRequiredValues = requiredFields.every(
    (field) =>
      state[field as keyof PersonalInfoState] && state[field as keyof PersonalInfoState] !== '',
  );
  const hasNoErrors = Object.values(state.errors).every((error) => !error);
  return hasRequiredValues && hasNoErrors;
});
