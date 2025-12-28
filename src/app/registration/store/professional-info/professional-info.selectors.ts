import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfessionalInfoState } from './professional-info.state';

export const selectProfessionalInfoState = createFeatureSelector<ProfessionalInfoState>('professionalInfo');

export const selectField = (field: string) => createSelector(
  selectProfessionalInfoState,
  (state) => (state as any)[field]
);

export const selectError = (field: string) => createSelector(
  selectProfessionalInfoState,
  (state) => state.errors[field]
);

export const selectTouched = (field: string) => createSelector(
  selectProfessionalInfoState,  
  (state) => state.touched[field] || false
);

export const selectProfessionalInfoComplete = createSelector(
  selectProfessionalInfoState,
  (state) => {
    const requiredFields = ['jobTitle', 'industry', 'educationLevel'];
    const hasRequiredValues = requiredFields.every(field => !!(state as any)[field]);
    const hasNoErrors = Object.values(state.errors).every(error => !error);
    return hasRequiredValues && hasNoErrors;
  }
);