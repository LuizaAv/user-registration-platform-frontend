import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PreferencesState } from './preferences.state';

export const selectPreferencesState = createFeatureSelector<PreferencesState>('preferences');

export const selectField = (field: string) => createSelector(
  selectPreferencesState,
  (state) => (state as any)[field]
);

export const selectError = (field: string) => createSelector(
  selectPreferencesState,
  (state) => state.errors[field]
);

export const selectTouched = (field: string) => createSelector(
  selectPreferencesState,
  (state) => state.touched[field] || false
);

export const selectPreferencesComplete = createSelector(
  selectPreferencesState,
  (state) => {
    const hasCareerGoals = state.careerGoals && state.careerGoals.length >= 1 && state.careerGoals.length <= 5;
    const hasCompanySize = state.companySize && state.companySize.length >= 1;
    const hasNoErrors = Object.values(state.errors).every(error => !error);
    return hasCareerGoals && hasCompanySize && hasNoErrors;
  }
);