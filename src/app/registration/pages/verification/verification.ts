import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrationService } from '../../registration.service';
import { RegistrationApiService } from '../../../core/api/registration-api.service';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { PreferredCompanySize, NewsletterSubscription } from '../../../shared/enums/enum';
import * as PersonalInfoSelectors from '../../store/personal-info/personal-info.selectors';
import * as ProfessionalInfoSelectors from '../../store/professional-info/professional-info.selectors';
import * as PreferencesSelectors from '../../store/preferences/preferences.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verification.html',
  styleUrls: ['./verification.scss'],
})
export class Verification implements OnInit {
  started$: Observable<boolean> | undefined;
  termsAccepted = false;
  privacyAccepted = false;
  submitting = false;
  error: string | null = null;

  industries: { [id: string]: string } = {};
  timezones: { [id: string]: string } = {};
  skills: { [id: string]: string } = {};
  careerGoals: { [id: string]: string } = {};
  jobTitles: { [id: string]: string } = {};

  availableLanguages: string[] = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Portuguese',
    'Italian',
    'Russian',
  ];
  proficiencies: string[] = ['basic', 'intermediate', 'fluent', 'native'];
  newsletterOptions: string[] = Object.values(NewsletterSubscription);
  languages: { language: string; proficiency: string }[] = [
    { language: 'English', proficiency: 'fluent' },
  ];
  newsletterSubscription: string[] = [NewsletterSubscription.ALL_OFF];

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private api: RegistrationApiService,
    private store: Store,
  ) {
    this.started$ = this.registrationService.started$;
  }

  ngOnInit() {
    this.loadReferenceData();
  }

  private loadReferenceData() {
    this.api.getIndustries().subscribe({
      next: (response) => {
        this.industries = response.data.reduce(
          (acc, item) => {
            acc[item.id] = item.name;
            return acc;
          },
          {} as { [id: string]: string },
        );
      },
    });

    this.api.getTimeZones().subscribe({
      next: (response) => {
        this.timezones = response.data.reduce(
          (acc, item) => {
            acc[item.id] = item.name;
            return acc;
          },
          {} as { [id: string]: string },
        );
      },
    });

    this.api.getSkills().subscribe({
      next: (response) => {
        this.skills = response.data.reduce(
          (acc, item) => {
            acc[item.id] = item.name;
            return acc;
          },
          {} as { [id: string]: string },
        );
      },
    });

    this.api.getCareerGoals().subscribe({
      next: (response) => {
        this.careerGoals = response.data.reduce(
          (acc, item) => {
            acc[item.id] = item.name;
            return acc;
          },
          {} as { [id: string]: string },
        );
      },
    });

    this.api.getJobTitles().subscribe({
      next: (response) => {
        this.jobTitles = response.data.reduce(
          (acc, item) => {
            acc[item.id] = item.name;
            return acc;
          },
          {} as { [id: string]: string },
        );
      },
    });
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

  goPrevious() {
    this.router.navigate(['/registration/preferences']);
  }

  addLanguage() {
    this.languages.push({ language: 'English', proficiency: 'basic' });
  }

  removeLanguage(index: number) {
    this.languages.splice(index, 1);
  }

  updateNewsletter(event: Event, option: string) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    if (checked) {
      if (!this.newsletterSubscription.includes(option)) {
        this.newsletterSubscription.push(option);
      }
    } else {
      this.newsletterSubscription = this.newsletterSubscription.filter((o) => o !== option);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  private getCareerGoalName(goalId: string): string {
    return this.careerGoals[goalId] || goalId;
  }

  private mapCompanySize(sizeId: string): string {
    const sizeMap: { [key: string]: string } = {
      startup: PreferredCompanySize.STARTUP,
      small: PreferredCompanySize.SMALL,
      medium: PreferredCompanySize.MEDIUM,
      enterprise: PreferredCompanySize.ENTERPRISE,
    };
    return sizeMap[sizeId] || sizeId;
  }

  submitRegistration() {
    if (!this.termsAccepted) {
      this.error = 'You must accept the terms and conditions';
      return;
    }
    if (!this.privacyAccepted) {
      this.error = 'You must accept the privacy policy';
      return;
    }

    this.submitting = true;
    this.error = null;

    combineLatest([
      this.store.select(PersonalInfoSelectors.selectPersonalInfo),
      this.store.select(ProfessionalInfoSelectors.selectProfessionalInfoState),
      this.store.select(PreferencesSelectors.selectPreferencesState),
    ])
      .pipe(take(1))
      .subscribe(([personalInfo, professionalInfo, preferences]) => {
        const registrationData = {
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          email: personalInfo.email,
          phone_number: personalInfo.phone,
          date_of_birth: personalInfo.dob,
          gender: personalInfo.gender
            ? personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1)
            : personalInfo.gender,
          profile_avatar: personalInfo.avatar || null,
          bio: personalInfo.bio,
          current_job_title: professionalInfo.jobTitle,
          industry: this.industries[professionalInfo.industry] || professionalInfo.industry,
          years_of_experience: professionalInfo.yearsOfExperience,
          employment_period: {
            start: professionalInfo.employmentStartDate,
            end: professionalInfo.currentlyEmployed ? null : professionalInfo.employmentEndDate,
          },
          education_level: professionalInfo.educationLevel,
          skills: professionalInfo.skills
            ? professionalInfo.skills.map((skillId: string) => this.skills[skillId] || skillId)
            : [],
          linked_in_URL: professionalInfo.linkedinUrl,
          career_goals: preferences.careerGoals
            ? preferences.careerGoals.map((goalId: string) => this.getCareerGoalName(goalId))
            : [],
          preferred_company_size: preferences.companySize
            ? preferences.companySize.map((sizeId: string) => this.mapCompanySize(sizeId))
            : [],
          availability_date: preferences.availabilityDate,
          time_zone: this.timezones[preferences.timezone] || preferences.timezone,
          languages: this.languages,
          newsletter_subscription: this.newsletterSubscription,
          is_terms_accepted: this.termsAccepted,
          is_privacy_policy_accepted: this.privacyAccepted,
        };

        this.api.submitRegistration(registrationData).subscribe({
          next: (response) => {
            this.submitting = false;
            if (response.statusCode === 201) {
              this.router.navigate(['/registration/complete', response.newRegistration.id], {
                state: { registrationData: response.newRegistration },
              });
            } else {
              this.error = 'Registration failed. Please try again.';
            }
          },
          error: (err) => {
            this.submitting = false;
            this.error = 'Failed to submit registration. Please try again.';
          },
        });
      });
  }
}
