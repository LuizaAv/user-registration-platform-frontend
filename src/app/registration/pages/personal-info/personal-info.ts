import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest, Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError } from 'rxjs/operators';
import { RegistrationApiService } from '../../../core/api/registration-api.service';
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

  get showNavigation(): boolean {
    const currentUrl = this.router.url;
    return ['/registration/personal-info', '/registration/professional', '/registration/preferences', '/registration/verification'].includes(currentUrl);
  }

  private emailInput$ = new Subject<string>();
  emailLoading = false;

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private validateName(name: string, field: string): string | null {
    if (!name || name.trim().length === 0) {
      return `${field} is required`;
    }
    if (name.length < 2 || name.length > 50) {
      return `${field} must be 2-50 characters`;
    }
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
      return `${field} must contain only letters, spaces, hyphens, and apostrophes`;
    }
    return null;
  }

  private validatePhone(phone: string): string | null {
    if (!phone || phone.trim().length === 0) {
      return 'Phone number is required';
    }
    const phoneRegex = /^\+\d{1,4}[\s\-\(\)]*\d[\s\-\(\)\d]*$/;
    if (!phoneRegex.test(phone) || phone.replace(/[\s\-\(\)]/g, '').length < 7) {
      return 'Please enter a valid international phone number';
    }
    return null;
  }

  private validateDob(dob: string): string | null {
    if (!dob) {
      return 'Date of birth is required';
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return 'You must be at least 18 years old';
    }
    if (age > 120) {
      return 'Please enter a valid date of birth';
    }
    return null;
  }

  private validateGender(gender: string): string | null {
    if (!gender || gender.trim().length === 0) {
      return 'Please select a gender';
    }
    return null;
  }

  constructor(private readonly store: Store, private readonly router: Router, private readonly registrationService: RegistrationService, private readonly api: RegistrationApiService) {
    this.isComplete$ = combineLatest([
      this.store.select(Selectors.selectField('firstName')),
      this.store.select(Selectors.selectField('lastName')),
      this.store.select(Selectors.selectField('email')),
      this.store.select(Selectors.selectField('phone')),
      this.store.select(Selectors.selectField('dob')),
      this.store.select(Selectors.selectField('gender')),
      this.store.select(Selectors.selectError('firstName')),
      this.store.select(Selectors.selectError('lastName')),
      this.store.select(Selectors.selectError('email')),
      this.store.select(Selectors.selectError('phone')),
      this.store.select(Selectors.selectError('dob')),
      this.store.select(Selectors.selectError('gender')),
    ]).pipe(
      map(([firstName, lastName, email, phone, dob, gender, e1, e2, e3, e4, e5, e6]) => {
        const valuesOk = !!firstName && !!lastName && !!email && !!phone && !!dob && !!gender;
        const noErrors = !e1 && !e2 && !e3 && !e4 && !e5 && !e6;
        return valuesOk && noErrors;
      }),
    );

    this.started$ = this.registrationService.started$;

    this.emailInput$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(v => !!v),
        tap(() => {
          this.emailLoading = true;
        }),
        switchMap(email =>
          this.api.validateEmail(email).pipe(
            map(() => ({ ok: true, message: null })),
            catchError((err) => of({ ok: false, message: (err && err.error && err.error.message) || err.message || 'This email is already registered' })),
          ),
        ),
      )
      .subscribe(res => {
        this.emailLoading = false;
        if (res.ok) {
          this.store.dispatch(Actions.setFieldError({ field: 'email', error: null }));
        } else {
          this.store.dispatch(Actions.setFieldError({ field: 'email', error: res.message }));
        }
      });
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
    
    let error: string | null = null;
    if (value) {
      switch (field) {
        case 'firstName':
          error = this.validateName(value, 'First name');
          break;
        case 'lastName':
          error = this.validateName(value, 'Last name');
          break;
        case 'email':
          if (!this.isValidEmail(value.trim())) {
            error = 'Invalid email format';
          } else {
            this.store.dispatch(Actions.setFieldError({ field: 'email', error: null }));
            this.emailInput$.next(value.trim());
            return;
          }
          break;
        case 'phone':
          error = this.validatePhone(value);
          break;
        case 'dob':
          error = this.validateDob(value);
          break;
        case 'gender':
          error = this.validateGender(value);
          break;
      }
    } else if (['firstName', 'lastName', 'email', 'phone', 'dob', 'gender'].includes(field)) {
      const fieldNames: { [key: string]: string } = {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone number',
        dob: 'Date of birth',
        gender: 'Gender'
      };
      error = `${fieldNames[field]} is required`;
    }
    
    this.store.dispatch(Actions.setFieldError({ field, error }));
  }

  onAvatarSelected(event: { dataUrl: string | null; fileInfo?: { size: number; type: string } | null; error?: string | null }) {
    this.update('avatar', event.dataUrl, event.fileInfo ?? null);
  }

  goPrevious() {
    this.router.navigate(['/registration']);
  }

  goNext() {
    this.router.navigate(['/registration/professional']);
  }

  blur(field: string) {
    this.store.dispatch(Actions.blurField({ field }));
  }
}
