import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { RegistrationService } from '../../registration.service';
import { RegistrationApiService } from '../../../core/api/registration-api.service';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {
  FormSelectComponent,
  SelectOption,
} from '../../../components/form-select/form-select.component';
import {
  FormMultiselectComponent,
  MultiselectOption,
} from '../../../components/form-multiselect/form-multiselect.component';
import { FormDateComponent } from '../../../components/form-date/form-date.component';
import * as Actions from '../../store/preferences/preferences.actions';
import * as Selectors from '../../store/preferences/preferences.selectors';
import { Language } from '../../store/preferences/preferences.state';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormSelectComponent,
    FormMultiselectComponent,
    FormDateComponent,
  ],
  templateUrl: './preferences.html',
  styleUrls: ['./preferences.scss'],
})
export class Preferences implements OnInit, OnDestroy {
  timezones: SelectOption[] = [];
  careerGoals: MultiselectOption[] = [];
  selectedCareerGoals: MultiselectOption[] = [];

  selectedCompanySizes$!: Observable<string[]>;

  companySizeOptions = [
    { id: 'startup', name: 'Startup' },
    { id: 'small', name: 'Small' },
    { id: 'medium', name: 'Medium' },
    { id: 'enterprise', name: 'Enterprise' },
  ];

  languageOptions: SelectOption[] = [
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'French', value: 'french' },
    { label: 'German', value: 'german' },
    { label: 'Italian', value: 'italian' },
    { label: 'Chinese', value: 'chinese' },
    { label: 'Russian', value: 'russian' },
    { label: 'Other', value: 'other' },
  ];

  proficiencyLevels: SelectOption[] = [
    { label: 'Basic', value: 'basic' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Fluent', value: 'fluent' },
    { label: 'Native', value: 'native' },
  ];

  newsletterOptions = [
    { id: 'weeklyDigest', name: 'Weekly digest' },
    { id: 'productUpdates', name: 'Product updates' },
    { id: 'industryNews', name: 'Industry news' },
  ];

  timezoneLoading = false;
  careerGoalsLoading = false;

  minDate = new Date().toISOString().split('T')[0];
  maxDate: string;
  languages: Language[] = [];
  newsletterSubscriptions: { [key: string]: boolean } = {
    weeklyDigest: false,
    productUpdates: false,
    industryNews: false,
  };

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private store: Store,
    private registrationService: RegistrationService,
    private api: RegistrationApiService,
  ) {
    const max = new Date();
    max.setFullYear(max.getFullYear() + 2);
    this.maxDate = max.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadReferenceData();

    this.subscriptions.add(
      this.field('languages').subscribe((langs) => {
        this.languages = langs || [];
      }),
    );

    this.subscriptions.add(
      this.field('newsletterSubscriptions').subscribe((subs) => {
        this.newsletterSubscriptions = subs || {
          weeklyDigest: false,
          productUpdates: false,
          industryNews: false,
        };
      }),
    );

    this.subscriptions.add(
      this.field('careerGoals').subscribe((goalNames) => {
        this.updateSelectedCareerGoals(goalNames);
      }),
    );

    this.selectedCompanySizes$ = this.field('companySize') as Observable<string[]>;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get showNavigation(): boolean {
    const currentUrl = this.router.url;
    return [
      '/registration/personal-info',
      '/registration/professional',
      '/registration/preferences',
      '/registration/verification',
    ].includes(currentUrl);
  }

  private loadReferenceData() {
    this.loadTimezones();
    this.loadCareerGoals();
  }

  private loadTimezones() {
    this.timezoneLoading = true;
    this.api.getTimeZones().subscribe({
      next: (response) => {
        this.timezones = response.data.map((item) => ({ label: item.name, value: item.id }));
        this.timezoneLoading = false;
      },
      error: () => {
        this.timezoneLoading = false;
      },
    });
  }

  private loadCareerGoals() {
    this.careerGoalsLoading = true;
    this.api.getCareerGoals().subscribe({
      next: (response) => {
        this.careerGoals = response.data.map((item) => ({ id: item.id, name: item.name }));
        this.careerGoalsLoading = false;
        this.field('careerGoals')
          .subscribe((goalNames) => {
            this.updateSelectedCareerGoals(goalNames);
          })
          .unsubscribe();
      },
      error: () => {
        this.careerGoalsLoading = false;
      },
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

  update(field: string, value: any) {
    this.store.dispatch(Actions.updateField({ field, value }));
  }

  onCareerGoalsChange(selectedGoals: MultiselectOption[]) {
    this.selectedCareerGoals = selectedGoals;
    this.update(
      'careerGoals',
      selectedGoals.map((goal) => goal.name),
    );
  }

  onCompanySizeChange(optionId: string, checked: boolean) {
    this.field('companySize')
      .pipe(take(1))
      .subscribe((sizes: string[]) => {
        const currentSizes = sizes || [];
        const newSizes = checked
          ? [...currentSizes, optionId]
          : currentSizes.filter((id) => id !== optionId);

        this.update('companySize', newSizes);
      });
  }

  private updateSelectedCareerGoals(goalNames: string[]) {
    if (goalNames && this.careerGoals.length > 0) {
      this.selectedCareerGoals = this.careerGoals.filter((goal) => goalNames.includes(goal.name));
    }
  }

  getTimezoneValue() {
    return this.field('timezone').pipe(
      map((timezoneName) => {
        if (timezoneName && this.timezones.length > 0) {
          const timezoneOption = this.timezones.find((tz) => tz.label === timezoneName);
          return timezoneOption ? timezoneOption.value : '';
        }
        return '';
      }),
    );
  }

  onTimezoneChange(timezoneId: string) {
    const selectedTimezone = this.timezones.find((tz) => tz.value === timezoneId);
    const timezoneName = selectedTimezone ? selectedTimezone.label : timezoneId;
    this.update('timezone', timezoneName);
  }

  isCompanySizeSelected(optionId: string): Observable<boolean> {
    return this.field('companySize').pipe(
      map((sizes) => (sizes ? sizes.includes(optionId) : false)),
    );
  }

  get isCareerGoalsValid(): boolean {
    return this.selectedCareerGoals.length >= 1 && this.selectedCareerGoals.length <= 5;
  }

  get isCompanySizeValid(): Observable<boolean> {
    return this.field('companySize').pipe(map((sizes) => (sizes ? sizes.length >= 1 : false)));
  }

  get isFormValid(): Observable<boolean> {
    return this.isCompanySizeValid.pipe(
      map((companySizeValid) => this.isCareerGoalsValid && companySizeValid),
    );
  }

  addLanguage() {
    if (this.languages.length < 5) {
      const newLanguages = [...this.languages, { name: '', proficiency: '' }];
      this.update('languages', newLanguages);
    }
  }

  removeLanguage(index: number) {
    const newLanguages = this.languages.filter((_, i) => i !== index);
    this.update('languages', newLanguages);
  }

  updateLanguage(index: number, field: 'name' | 'proficiency', value: string) {
    const newLanguages = this.languages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang,
    );
    this.update('languages', newLanguages);
  }

  onNewsletterChange(optionId: string, checked: boolean) {
    const updated = { ...this.newsletterSubscriptions, [optionId]: checked };
    this.update('newsletterSubscriptions', updated);
  }

  isNewsletterSelected(optionId: string): boolean {
    return this.newsletterSubscriptions[optionId] || false;
  }

  goPrevious() {
    this.router.navigate(['/registration/professional']);
  }

  goNext() {
    this.isFormValid
      .subscribe((isValid) => {
        if (isValid) {
          this.router.navigate(['/registration/verification']);
        }
      })
      .unsubscribe();
  }

  blur(field: string) {
    this.store.dispatch(Actions.blurField({ field }));
  }
}
