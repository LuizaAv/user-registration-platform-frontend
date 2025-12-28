import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, BehaviorSubject, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RegistrationService } from '../../registration.service';
import { RegistrationApiService } from '../../../core/api/registration-api.service';
import { AsyncPipe } from '@angular/common';
import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { FormDateComponent } from '../../../components/form-date/form-date.component';
import {
  FormSelectComponent,
  SelectOption,
} from '../../../components/form-select/form-select.component';
import {
  FormAutocompleteComponent,
  AutocompleteOption,
} from '../../../components/form-autocomplete/form-autocomplete.component';
import { FormSliderComponent } from '../../../components/form-slider/form-slider.component';
import {
  FormMultiselectComponent,
  MultiselectOption,
} from '../../../components/form-multiselect/form-multiselect.component';
import { EducationLevel } from '../../../shared/enums/enum';
import * as Actions from '../../store/professional-info/professional-info.actions';
import * as Selectors from '../../store/professional-info/professional-info.selectors';
import { isValidLLinkedInUrl, validateEducationLevel, validateIndustry, validateJobTitle } from '../../../core/helper-functions/validation';

@Component({
  selector: 'app-professional',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormInputComponent,
    FormDateComponent,
    FormSelectComponent,
    FormAutocompleteComponent,
    FormSliderComponent,
    FormMultiselectComponent,
  ],
  templateUrl: './professional.html',
  styleUrls: ['./professional.scss'],
})
export class Professional implements OnInit {
  educationOptions: SelectOption[] = [
    { label: 'High School', value: EducationLevel.HIGH_SHCOOL },
    { label: 'Bachelor', value: EducationLevel.BACHELOR },
    { label: 'Master', value: EducationLevel.MASTER },
    { label: 'PhD', value: EducationLevel.PHD },
    { label: 'Other', value: EducationLevel.OTHER },
  ];

  jobTitles: AutocompleteOption[] = [];
  industries: SelectOption[] = [];
  skills: MultiselectOption[] = [];
  selectedSkills$: Observable<MultiselectOption[]> = of([]);

  jobTitleLoading = false;
  industryLoading = false;
  skillsLoading = false;
  dateRangeError: string | null = null;
  private skillsLoaded = new BehaviorSubject<MultiselectOption[]>([]);

  isComplete$: Observable<boolean> | undefined;

  constructor(
    private router: Router,
    private store: Store,
    private registrationService: RegistrationService,
    private api: RegistrationApiService,
  ) {}

  ngOnInit() {
    this.loadReferenceData();

    this.selectedSkills$ = combineLatest([
      this.store.select(Selectors.selectField('skills')),
      this.skillsLoaded,
    ]).pipe(
      map(([skillIds, options]) =>
        skillIds ? options.filter((skill) => skillIds.includes(skill.id)) : [],
      ),
    );

    this.isComplete$ = combineLatest([
      this.store.select(Selectors.selectField('jobTitle')),
      this.store.select(Selectors.selectField('industry')),
      this.store.select(Selectors.selectField('educationLevel')),
      this.store.select(Selectors.selectError('jobTitle')),
      this.store.select(Selectors.selectError('industry')),
      this.store.select(Selectors.selectError('educationLevel')),
    ]).pipe(
      map(([jobTitle, industry, educationLevel, e1, e2, e3]) => {
        const valuesOk = !!jobTitle && !!industry && !!educationLevel;
        const noErrors = !e1 && !e2 && !e3;
        return valuesOk && noErrors;
      }),
    );
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

  get yearsOfExperienceValue(): Observable<number> {
    return this.store
      .select(Selectors.selectField('yearsOfExperience'))
      .pipe(map((value) => value || 0));
  }

  private loadReferenceData() {
    this.loadJobTitles();
    this.loadIndustries();
    this.loadSkills();
  }

  private loadJobTitles() {
    this.jobTitleLoading = true;
    this.api.getJobTitles().subscribe({
      next: (response) => {
        this.jobTitles = response.data.map((item) => ({ id: item.id, name: item.name }));
        this.jobTitleLoading = false;
      },
      error: () => {
        this.jobTitleLoading = false;
      },
    });
  }

  private loadIndustries() {
    this.industryLoading = true;
    this.api.getIndustries().subscribe({
      next: (response) => {
        const grouped = response.data.reduce(
          (acc, item) => {
            const category = item.category || 'Select an Industry';
            if (!acc[category]) acc[category] = [];
            acc[category].push({ label: item.name, value: item.id });
            return acc;
          },
          {} as Record<string, SelectOption[]>,
        );

        this.industries = Object.entries(grouped).flatMap(([category, options]) => [
          { label: `${category}`, value: '', disabled: true },
          ...options,
        ]);
        this.industryLoading = false;
      },
      error: () => {
        this.industryLoading = false;
      },
    });
  }

  private loadSkills() {
    this.skillsLoading = true;
    this.api.getSkills().subscribe({
      next: (response) => {
        this.skills = response.data.map((item) => ({ id: item.id, name: item.name }));
        this.skillsLoaded.next(this.skills);
        this.skillsLoading = false;
      },
      error: () => {
        this.skillsLoading = false;
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

    let error: string | null = null;
    if (value) {
      switch (field) {
        case 'jobTitle':
          error = validateJobTitle(value);
          break;
        case 'industry':
          error = validateIndustry(value);
          break;
        case 'educationLevel':
          error = validateEducationLevel(value);
          break;
        case 'employmentStartDate':
        case 'employmentEndDate':
          let startDate: any = null;
          let endDate: any = null;
          let currentlyEmployed: any = null;

          this.store
            .select(Selectors.selectField('employmentStartDate'))
            .pipe(take(1))
            .subscribe((val) => (startDate = val));
          this.store
            .select(Selectors.selectField('employmentEndDate'))
            .pipe(take(1))
            .subscribe((val) => (endDate = val));
          this.store
            .select(Selectors.selectField('currentlyEmployed'))
            .pipe(take(1))
            .subscribe((val) => (currentlyEmployed = val));

          this.dateRangeError = null;

          if (!currentlyEmployed && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end <= start) {
              this.dateRangeError = 'End date must be after start date';
            }
          }
          break;
        case 'linkedinUrl':
          error = isValidLLinkedInUrl(value);
          break;
        case 'currentlyEmployed':
          if (value) {
            this.store.dispatch(Actions.setFieldError({ field: 'employmentEndDate', error: null }));
            this.dateRangeError = null;
          }
          break;
      }
    } else if (['jobTitle', 'industry', 'educationLevel'].includes(field)) {
      const fieldNames: { [key: string]: string } = {
        jobTitle: 'Job title',
        industry: 'Industry',
        educationLevel: 'Education level',
      };
      error = `${fieldNames[field]} is required`;
    }

    if (error !== undefined) {
      this.store.dispatch(Actions.setFieldError({ field, error }));
    }
  }

  onSkillsChange(selectedSkills: MultiselectOption[]) {
    this.update(
      'skills',
      selectedSkills.map((skill) => skill.id),
    );
  }

  goPrevious() {
    this.router.navigate(['/registration/personal-info']);
  }

  goNext() {
    this.store
      .select(Selectors.selectProfessionalInfoComplete)
      .pipe(take(1))
      .subscribe((isComplete) => {
        if (isComplete) {
          this.router.navigate(['/registration/preferences']);
        } else {
          const fields = ['jobTitle', 'industry', 'educationLevel'];
          fields.forEach((field) => this.blur(field));
        }
      });
  }

  blur(field: string) {
    this.store.dispatch(Actions.blurField({ field }));
  }
}
