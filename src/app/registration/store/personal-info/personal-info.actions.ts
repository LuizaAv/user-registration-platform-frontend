import { createAction, props } from '@ngrx/store';

export const updateField = createAction(
  '[Personal Info] Update Field',
  props<{ field: string; value: string | null; fileInfo?: { size: number; type: string } | null }>()
);

export const blurField = createAction(
  '[Personal Info] Blur Field',
  props<{ field: string }>()
);
