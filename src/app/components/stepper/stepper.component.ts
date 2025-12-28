import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as PersonalInfoSelectors from '../../registration/store/personal-info/personal-info.selectors';
import * as ProfessionalInfoSelectors from '../../registration/store/professional-info/professional-info.selectors';
import * as PreferencesSelectors from '../../registration/store/preferences/preferences.selectors';

export interface Step {
  id: string;
  title: string;
  route: string;
  completed: boolean;
  current: boolean;
  accessible: boolean;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnDestroy {
  steps: Step[] = [
    {
      id: 'personal-info',
      title: 'Personal Info',
      route: '/registration/personal-info',
      completed: false,
      current: false,
      accessible: true,
    },
    {
      id: 'professional',
      title: 'Professional',
      route: '/registration/professional',
      completed: false,
      current: false,
      accessible: false,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      route: '/registration/preferences',
      completed: false,
      current: false,
      accessible: false,
    },
    {
      id: 'verification',
      title: 'Verification',
      route: '/registration/verification',
      completed: false,
      current: false,
      accessible: false,
    },
    {
      id: 'complete',
      title: 'Complete',
      route: '/registration/complete',
      completed: false,
      current: false,
      accessible: false,
    },
  ];

  private subscription = new Subscription();

  constructor(
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit() {
    this.updateCurrentStep();

    this.subscription.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.updateCurrentStep();
      }),
    );

    this.subscription.add(
      combineLatest([
        this.store.select(PersonalInfoSelectors.selectPersonalInfoComplete),
        this.store.select(ProfessionalInfoSelectors.selectProfessionalInfoComplete),
        this.store.select(PreferencesSelectors.selectPreferencesComplete),
      ]).subscribe(([personalComplete, professionalComplete, preferencesComplete]) => {
        this.updateStepStatuses(personalComplete, professionalComplete, preferencesComplete);
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onStepClick(step: Step) {
    if (step.accessible) {
      this.router.navigate([step.route]);
    }
  }

  private updateCurrentStep() {
    const currentRoute = this.router.url;
    this.steps.forEach((step) => {
      step.current = currentRoute === step.route || currentRoute.endsWith(step.route);
    });
  }

  private updateStepStatuses(
    personalComplete: boolean,
    professionalComplete: boolean,
    preferencesComplete: boolean,
  ) {
    this.steps[0].completed = personalComplete;
    this.steps[1].completed = professionalComplete;
    this.steps[2].completed = preferencesComplete;
    this.steps[3].completed = preferencesComplete;
    this.steps[4].completed = false;

    this.steps[0].accessible = true;
    this.steps[1].accessible = personalComplete;
    this.steps[2].accessible = personalComplete && professionalComplete;
    this.steps[3].accessible = personalComplete && professionalComplete && preferencesComplete;
    this.steps[4].accessible = personalComplete && professionalComplete && preferencesComplete;
  }
}
