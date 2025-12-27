import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RegistrationService } from '../../registration.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './preferences.html',
  styleUrls: ['./preferences.scss'],
})
export class Preferences {
  started$: Observable<boolean> | undefined;

  constructor(private router: Router, private registrationService: RegistrationService) {
    this.started$ = this.registrationService.started$;
  }

  goPrevious() {
    this.router.navigate(['/registration/personal-info']);
  }

  goNext() {
    this.router.navigate(['/registration/professional']);
  }
}
