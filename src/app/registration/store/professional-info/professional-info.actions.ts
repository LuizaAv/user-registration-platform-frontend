import { createAction, props } from '@ngrx/store';

export const updateField = createAction(
  '[Professional Info] Update Field',
  props<{ field: string; value: any; fileInfo?: { size: number; type: string } | null }>()
);

export const setFieldError = createAction(
  '[Professional Info] Set Field Error',
  props<{ field: string; error: string | null }>()
);

export const blurField = createAction(
  '[Professional Info] Blur Field',
  props<{ field: string }>()
);

export const resetProfessionalInfo = createAction(
  '[Professional Info] Reset'
);