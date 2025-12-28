import { createReducer, on } from '@ngrx/store';
import { ProfessionalInfoState, initialProfessionalInfoState } from './professional-info.state';
import * as Actions from './professional-info.actions';

export const professionalInfoReducer = createReducer(
  initialProfessionalInfoState,
  on(Actions.updateField, (state, { field, value }) => {
    const newState = { ...state, [field]: value };
    if (typeof window !== 'undefined') {
      localStorage.setItem('professionalInfo', JSON.stringify(newState));
    }
    return newState;
  }),
  on(Actions.setFieldError, (state, { field, error }) => {
    const newErrors = { ...state.errors, [field]: error };
    const newState = { ...state, errors: newErrors };
    if (typeof window !== 'undefined') {
      localStorage.setItem('professionalInfo', JSON.stringify(newState));
    }
    return newState;
  }),
  on(Actions.blurField, (state, { field }) => {
    const newTouched = { ...state.touched, [field]: true };
    const newState = { ...state, touched: newTouched };
    if (typeof window !== 'undefined') {
      localStorage.setItem('professionalInfo', JSON.stringify(newState));
    }
    return newState;
  }),
  on(Actions.resetProfessionalInfo, () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('professionalInfo');
    }
    return initialProfessionalInfoState;
  })
);