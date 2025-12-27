import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { RegistrationService } from '../../registration.service';
import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { FormFileComponent } from '../../../components/form-file/form-file.component';
import * as Actions from '../../store/personal-info/personal-info.actions';
import * as Selectors from '../../store/personal-info/personal-info.selectors';
import { FormDateComponent } from '../../../components/form-date/form-date.component';
import {
  FormSelectComponent,
  SelectOption,
} from '../../../components/form-select/form-select.component';
import { FormTextareaComponent } from '../../../components/form-textarea/form-textarea.component';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [FormInputComponent, FormFileComponent, FormDateComponent, FormSelectComponent, FormTextareaComponent, AsyncPipe, CommonModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.scss'],
})
export class PersonalInfo {
  genderOptions: SelectOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  today = new Date();

  maxBirthDate = new Date(
    this.today.getFullYear() - 18,
    this.today.getMonth(),
    this.today.getDate(),
  )
    .toISOString()
    .split('T')[0];

  minBirthDate = new Date(
    this.today.getFullYear() - 120,
    this.today.getMonth(),
    this.today.getDate(),
  )
    .toISOString()
    .split('T')[0];

  isComplete$: import('rxjs').Observable<boolean> | undefined;

  started$: import('rxjs').Observable<boolean> | undefined;

  constructor(private readonly store: Store, private readonly router: Router, private readonly registrationService: RegistrationService) {
    this.isComplete$ = combineLatest([
      this.store.select(Selectors.selectField('firstName')),
      this.store.select(Selectors.selectField('lastName')),
      this.store.select(Selectors.selectField('email')),
      this.store.select(Selectors.selectField('dob')),
      this.store.select(Selectors.selectError('firstName')),
      this.store.select(Selectors.selectError('lastName')),
      this.store.select(Selectors.selectError('email')),
      this.store.select(Selectors.selectError('dob')),
    ]).pipe(
      map(([firstName, lastName, email, dob, e1, e2, e3, e4]) => {
        const valuesOk = !!firstName && !!lastName && !!email && !!dob;
        const noErrors = !e1 && !e2 && !e3 && !e4;
        return valuesOk && noErrors;
      }),
    );

    this.started$ = this.registrationService.started$;
  }

  field(field: string) {
    return this.store.select(Selectors.selectField(field));
  }

  error(field: string) {
    return this.store.select(Selectors.selectError(field));
  }

  touched(field: string) {
    return this.store.select(Selectors.selectTouched(field));
  }

  update(field: string, value: string | null, fileInfo?: { size: number; type: string } | null) {
    this.store.dispatch(Actions.updateField({ field, value, fileInfo }));
  }

  onAvatarSelected(event: { dataUrl: string | null; fileInfo?: { size: number; type: string } | null; error?: string | null }) {
    // when a file is selected the component emits dataUrl (or error). Send both value and file metadata to the store.
    this.update('avatar', event.dataUrl, event.fileInfo ?? null);
  }

  goPrevious() {
    // first step has no previous; keep for symmetry
    this.router.navigate(['/registration']);
  }

  goNext() {
    this.router.navigate(['/registration/professional']);
  }

  blur(field: string) {
    this.store.dispatch(Actions.blurField({ field }));
  }
}
