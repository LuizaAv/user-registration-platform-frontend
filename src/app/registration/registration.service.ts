import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private startedSubject = new BehaviorSubject<boolean>(false);
  readonly started$ = this.startedSubject.asObservable();

  start() {
    this.startedSubject.next(true);
  }

  isStarted(): boolean {
    return this.startedSubject.getValue();
  }
}
