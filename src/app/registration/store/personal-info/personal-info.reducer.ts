import { createReducer, on } from '@ngrx/store';
import * as Actions from './personal-info.actions';
import { initialPersonalInfoState } from './personal-info.state';

const nameRegex = /^[\p{L} '-]{2,50}$/u;

function validate(field: string, value: string | null, fileInfo?: { size: number; type: string } | null): string | null {
  if (typeof value === 'string') {
    if ((field === 'firstName' || field === 'lastName') && !nameRegex.test(value)) {
      return `${field === 'firstName' ? 'First name' : 'Last name'} must be 2-50 characters, letters only`;
    }
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    if (field === 'bio' && value.length > 500) {
      return 'Bio must be less than 500 characters';
    }

    if (field === 'avatar') {
      if (fileInfo) {
        if (fileInfo.size > 5 * 1024 * 1024) return 'File must be less than 5MB';
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowed.includes(fileInfo.type)) return 'Invalid file format';
      } else if (value) {
        const dataUrlMatch = /^data:(image\/[^;]+);base64,/.exec(value);
        if (dataUrlMatch) {
          const mime = dataUrlMatch[1];
          const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowed.includes(mime)) return 'Invalid file format';
        } else {
          const lower = value.toLowerCase();
          const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          const hasExt = allowedExt.some(e => lower.endsWith(e));
          if (!hasExt) return 'Invalid file format';
        }
      }
    }
  }
  return null;
}

export const personalInfoReducer = createReducer(
  initialPersonalInfoState,

  on(Actions.updateField, (state, { field, value, fileInfo }) => {
    const newState = {
      ...state,
      [field]: value,
      errors: {
        ...state.errors,
        [field]: validate(field, value, fileInfo),
      },
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('personalInfo', JSON.stringify(newState));
    }
    return newState;
  }),

  on(Actions.blurField, (state, { field }) => ({
    ...state,
    touched: {
      ...state.touched,
      [field]: true,
    },
  }))

  ,on(Actions.setFieldError, (state, { field, error }) => ({
    ...state,
    errors: {
      ...state.errors,
      [field]: error,
    },
  }))
);


