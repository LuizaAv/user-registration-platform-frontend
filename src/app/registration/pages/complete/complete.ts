import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationApiService } from '../../../core/api/registration-api.service';

@Component({
  selector: 'app-complete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complete.html',
  styleUrls: ['./complete.scss'],
})
export class Complete implements OnInit {
  registrationId: string | null = null;
  registrationData: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: RegistrationApiService,
  ) {}

  ngOnInit() {
    this.registrationId = this.route.snapshot.paramMap.get('id');
    if (typeof window !== 'undefined') {
      const state = history.state as { registrationData?: any };
      if (state.registrationData) {
        this.registrationData = state.registrationData;
        this.loading = false;
        this.clearStorage();
        return;
      }
    }
    if (this.registrationId) {
      this.loadRegistrationData();
    } else {
      this.error = 'No registration ID provided';
      this.loading = false;
    }
  }

  private clearStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('preferences');
      localStorage.removeItem('professionalInfo');
      localStorage.removeItem('registrationStarted');
    }
  }

  private loadRegistrationData() {
    if (!this.registrationId) return;

    this.api.getRegistration(this.registrationId).subscribe({
      next: (response) => {
        this.registrationData = response;
        this.loading = false;
        this.clearStorage();
      },
      error: (err) => {
        this.error = 'Failed to load registration data';
        this.loading = false;
      },
    });
  }

  startNewRegistration() {
    localStorage.clear();
    window.location.href = '/registration';
  }

  getFormattedLanguages(): string {
    if (!this.registrationData?.languages || !Array.isArray(this.registrationData.languages))
      return '';
    console.log(this.registrationData.languages);
    const changedLanguageArray = this.registrationData.languages.flat();
    console.log('flattened', changedLanguageArray);
    return changedLanguageArray
      .map((l: any) => (l && l.language && l.level ? `${l.language} (${l.level})` : ''))
      .filter(Boolean)
      .join(', ');
  }
}
