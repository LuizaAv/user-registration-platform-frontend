import { createAction, props } from '@ngrx/store';

export const updateField = createAction(
  '[Preferences] Update Field',
  props<{ field: string; value: any }>()
);

export const setFieldError = createAction(
  '[Preferences] Set Field Error',
  props<{ field: string; error: string | null }>()
);

export const blurField = createAction(
  '[Preferences] Blur Field',
  props<{ field: string }>()
);

export const resetPreferences = createAction(
  '[Preferences] Reset'
);