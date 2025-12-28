import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailValidationResponse, ReferenceItem } from '../models/personal-info.model';

@Injectable({ providedIn: 'root' })
export class RegistrationApiService {
  private base = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  validateEmail(email: string): Observable<EmailValidationResponse> {
    return this.http.post<EmailValidationResponse>(`${this.base}/validate/email`, { email });
  }

  getJobTitles(): Observable<{ message: string; data: ReferenceItem[] }> {
    return this.http.get<{ message: string; data: ReferenceItem[] }>(
      `${this.base}/reference/job-titles`,
    );
  }

  getIndustries(): Observable<{ message: string; data: ReferenceItem[] }> {
    return this.http.get<{ message: string; data: ReferenceItem[] }>(
      `${this.base}/reference/industries`,
    );
  }

  getSkills(): Observable<{ message: string; data: ReferenceItem[] }> {
    return this.http.get<{ message: string; data: ReferenceItem[] }>(
      `${this.base}/reference/skills`,
    );
  }

  getCareerGoals(): Observable<{ message: string; data: ReferenceItem[] }> {
    return this.http.get<{ message: string; data: ReferenceItem[] }>(
      `${this.base}/reference/career-goals`,
    );
  }

  getTimeZones(): Observable<{ message: string; data: ReferenceItem[] }> {
    return this.http.get<{ message: string; data: ReferenceItem[] }>(
      `${this.base}/reference/timezones`,
    );
  }

  submitRegistration(
    registrationData: any,
  ): Observable<{ newRegistration: any; statusCode: number; message: string }> {
    return this.http.post<{ newRegistration: any; statusCode: number; message: string }>(
      `${this.base}/registrations`,
      registrationData,
    );
  }

  getRegistration(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/registrations/${id}`);
  }
}
