import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RegistrationService } from '../../registration.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './verification.html',
  styleUrls: ['./verification.scss'],
})
export class Verification {
  started$: Observable<boolean> | undefined;

  constructor(private router: Router, private registrationService: RegistrationService) {
    this.started$ = this.registrationService.started$;
  }

  goPrevious() {
    this.router.navigate(['/registration/professional']);
  }

  goNext() {
    this.router.navigate(['/registration/professional']);
  }
}