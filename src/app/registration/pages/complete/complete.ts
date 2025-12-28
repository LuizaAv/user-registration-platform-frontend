import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute,
    private api: RegistrationApiService
  ) {}

  ngOnInit() {
    this.registrationId = this.route.snapshot.paramMap.get('id');
    const state = history.state as { registrationData?: any };
    if (state.registrationData) {
      this.registrationData = state.registrationData;
      this.loading = false;
    } else if (this.registrationId) {
      this.loadRegistrationData();
    } else {
      this.error = 'No registration ID provided';
      this.loading = false;
    }
  }

  private loadRegistrationData() {
    if (!this.registrationId) return;

    this.api.getRegistration(this.registrationId).subscribe({
      next: (response) => {
        this.registrationData = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load registration data';
        this.loading = false;
      }
    });
  }

  startNewRegistration() {
    this.router.navigate(['/registration/personal-info']);
  }

  getFormattedLanguages(): string {
    if (!this.registrationData?.languages) return '';
    return this.registrationData.languages.map((l: any) => `${l.language} (${l.level})`).join(', ');
  }
}