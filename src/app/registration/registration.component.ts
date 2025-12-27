import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  constructor(private router: Router, private registrationService: RegistrationService) {}

  get showStartButton(): boolean {
    const url = this.router.url || '';
    return !this.registrationService.isStarted() && (url === '/registration' || url === '' || url === '/');
  }

  startRegistration() {
    this.registrationService.start();
    this.router.navigate(['/registration/personal-info']);
  }
}