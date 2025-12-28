import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, take } from 'rxjs';
import * as PersonalInfoSelectors from '../registration/store/personal-info/personal-info.selectors';
import * as ProfessionalInfoSelectors from '../registration/store/professional-info/professional-info.selectors';
import * as PreferencesSelectors from '../registration/store/preferences/preferences.selectors';
import { StepStatus } from '../core/models/personal-info.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const targetStep = route.url[0]?.path;

    return this.getStepStatuses().pipe(
      take(1),
      map((statuses) => {
        const stepOrder = [
          'personal-info',
          'professional',
          'preferences',
          'verification',
          'complete',
        ];
        const targetIndex = stepOrder.indexOf(targetStep);

        if (targetIndex === -1) {
          this.router.navigate(['/registration/personal-info']);
          return false;
        }

        const canAccessStep =
          targetIndex === 0 ||
          statuses[stepOrder[targetIndex - 1] as keyof StepStatus] ||
          (targetIndex === this.getCurrentStepIndex(statuses) + 1 &&
            this.canAccessNextStep(statuses));

        if (canAccessStep) {
          return true;
        }

        const firstIncompleteStep = this.getFirstIncompleteStep(statuses);
        this.router.navigate([`/registration/${firstIncompleteStep}`]);
        return false;
      }),
    );
  }

  private getStepStatuses(): Observable<StepStatus> {
    return combineLatest([
      this.store.select(PersonalInfoSelectors.selectPersonalInfoComplete),
      this.store.select(ProfessionalInfoSelectors.selectProfessionalInfoComplete),
      this.store.select(PreferencesSelectors.selectPreferencesComplete),
    ]).pipe(
      map(([personalInfoComplete, professionalComplete, preferencesComplete]) => ({
        personalInfo: personalInfoComplete,
        professional: professionalComplete,
        preferences: preferencesComplete,
        verification: preferencesComplete,
        complete: false,
      })),
    );
  }

  private getCurrentStepIndex(statuses: StepStatus): number {
    const stepOrder: (keyof StepStatus)[] = [
      'personalInfo',
      'professional',
      'preferences',
      'verification',
      'complete',
    ];

    for (let i = stepOrder.length - 1; i >= 0; i--) {
      if (statuses[stepOrder[i]]) {
        return i;
      }
    }

    return 0;
  }

  private canAccessNextStep(statuses: StepStatus): boolean {
    const currentIndex = this.getCurrentStepIndex(statuses);
    const stepOrder: (keyof StepStatus)[] = [
      'personalInfo',
      'professional',
      'preferences',
      'verification',
      'complete',
    ];

    return currentIndex < stepOrder.length - 1 && statuses[stepOrder[currentIndex]];
  }

  private getFirstIncompleteStep(statuses: StepStatus): string {
    const stepMap = {
      personalInfo: 'personal-info',
      professional: 'professional',
      preferences: 'preferences',
      verification: 'verification',
      complete: 'complete',
    };

    const stepOrder: (keyof StepStatus)[] = [
      'personalInfo',
      'professional',
      'preferences',
      'verification',
      'complete',
    ];

    for (const step of stepOrder) {
      if (!statuses[step]) {
        return stepMap[step];
      }
    }

    return 'personal-info';
  }
}
