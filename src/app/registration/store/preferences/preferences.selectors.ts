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
    // Preferences might be optional, so always return true for now
    return true;
  }
);