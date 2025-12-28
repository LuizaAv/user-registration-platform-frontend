import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { RegistrationService } from '../../registration.service';
import { RegistrationApiService } from '../../../core/api/registration-api.service';
import { Observable } from 'rxjs';
import { FormSelectComponent, SelectOption } from '../../../components/form-select/form-select.component';
import { FormMultiselectComponent, MultiselectOption } from '../../../components/form-multiselect/form-multiselect.component';
import { FormDateComponent } from '../../../components/form-date/form-date.component';
import * as Actions from '../../store/preferences/preferences.actions';
import * as Selectors from '../../store/preferences/preferences.selectors';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormSelectComponent, FormMultiselectComponent, FormDateComponent],
  templateUrl: './preferences.html',
  styleUrls: ['./preferences.scss'],
})
export class Preferences implements OnInit {
  timezones: SelectOption[] = [];
  careerGoals: MultiselectOption[] = [];
  selectedCareerGoals: MultiselectOption[] = [];

  companySizeOptions = [
    { id: 'startup', name: 'Startup' },
    { id: 'small', name: 'Small' },
    { id: 'medium', name: 'Medium' },
    { id: 'enterprise', name: 'Enterprise' }
  ];

  timezoneLoading = false;
  careerGoalsLoading = false;

  minDate = new Date().toISOString().split('T')[0];
  maxDate: string;
  selectedCompanySizes: string[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private registrationService: RegistrationService,
    private api: RegistrationApiService
  ) {
    const max = new Date();
    max.setFullYear(max.getFullYear() + 2);
    this.maxDate = max.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadReferenceData();
  }

  get showNavigation(): boolean {
    const currentUrl = this.router.url;
    return ['/registration/personal-info', '/registration/professional', '/registration/preferences', '/registration/verification'].includes(currentUrl);
  }

  private loadReferenceData() {
    this.loadTimezones();
    this.loadCareerGoals();
  }

  private loadTimezones() {
    this.timezoneLoading = true;
    this.api.getTimeZones().subscribe({
      next: (response) => {
        this.timezones = response.data.map(item => ({ label: item.name, value: item.id }));
        this.timezoneLoading = false;
      },
      error: () => {
        this.timezoneLoading = false;
      }
    });
  }

  private loadCareerGoals() {
    this.careerGoalsLoading = true;
    this.api.getCareerGoals().subscribe({
      next: (response) => {
        this.careerGoals = response.data.map(item => ({ id: item.id, name: item.name }));
        this.careerGoalsLoading = false;
      },
      error: () => {
        this.careerGoalsLoading = false;
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

  update(field: string, value: any) {
    this.store.dispatch(Actions.updateField({ field, value }));
  }

  onCareerGoalsChange(selectedGoals: MultiselectOption[]) {
    this.selectedCareerGoals = selectedGoals;
    this.update('careerGoals', selectedGoals.map(goal => goal.id));
  }

  onCompanySizeChange(optionId: string, checked: boolean) {
    if (checked) {
      this.selectedCompanySizes.push(optionId);
    } else {
      this.selectedCompanySizes = this.selectedCompanySizes.filter(id => id !== optionId);
    }
    this.update('companySize', this.selectedCompanySizes);
  }

  isCompanySizeSelected(optionId: string): boolean {
    return this.selectedCompanySizes.includes(optionId);
  }

  goPrevious() {
    this.router.navigate(['/registration/professional']);
  }

  goNext() {
    if (this.selectedCareerGoals.length < 1 || this.selectedCareerGoals.length > 5) {
      alert('Please select 1-5 career goals');
      return;
    }
    if (this.selectedCompanySizes.length < 1) {
      alert('Please select at least one company size');
      return;
    }
    this.router.navigate(['/registration/verification']);
  }

  blur(field: string) {
    this.store.dispatch(Actions.blurField({ field }));
  }
}
