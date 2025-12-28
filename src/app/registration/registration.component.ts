import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RegistrationService } from './registration.service';
import { StepperComponent } from '../components/stepper/stepper.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StepperComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  showStartButton = true;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private registrationService: RegistrationService
  ) {}

  ngOnInit() {
    this.updateShowStartButton();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateShowStartButton();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateShowStartButton() {
    const hasData = this.hasStoredData();
    const isOnRoot = this.activatedRoute.children.length === 0;
    this.showStartButton = !hasData && isOnRoot;
  }

  private hasStoredData(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      localStorage.getItem('personalInfo') ||
      localStorage.getItem('preferences') ||
      localStorage.getItem('professionalInfo')
    );
  }

  startRegistration() {
    this.registrationService.start();
    this.showStartButton = false;
    this.router.navigate(['personal-info'], { relativeTo: this.activatedRoute });
  }
}