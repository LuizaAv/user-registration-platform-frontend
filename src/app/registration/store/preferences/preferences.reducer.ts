import { createReducer, on } from '@ngrx/store';
import { PreferencesState, initialPreferencesState } from './preferences.state';
import * as Actions from './preferences.actions';

export const preferencesReducer = createReducer(
  initialPreferencesState,
  on(Actions.updateField, (state, { field, value }) => {
    const newState = { ...state, [field]: value };
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferences', JSON.stringify(newState));
    }
    return newState;
  }),
  on(Actions.setFieldError, (state, { field, error }) => {
    const newErrors = { ...state.errors, [field]: error };
    const newState = { ...state, errors: newErrors };
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferences', JSON.stringify(newState));
    }
    return newState;
  }),
  on(Actions.blurField, (state, { field }) => {
    const newTouched = { ...state.touched, [field]: true };
    const newState = { ...state, touched: newTouched };
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferences', JSON.stringify(newState));
    }
    return newState;
  }),
  on(Actions.resetPreferences, () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('preferences');
    }
    return initialPreferencesState;
  })
);