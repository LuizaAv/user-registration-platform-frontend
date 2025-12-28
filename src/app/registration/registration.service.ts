import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private startedSubject = new BehaviorSubject<boolean>(this.getStoredStarted());
  readonly started$ = this.startedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private getStoredStarted(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('registrationStarted');
      return stored === 'true';
    }
    return false;
  }

  start() {
    this.startedSubject.next(true);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('registrationStarted', 'true');
    }
  }

  isStarted(): boolean {
    return this.startedSubject.getValue();
  }
}
