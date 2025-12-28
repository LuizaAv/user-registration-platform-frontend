import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  showStartButton = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private registrationService: RegistrationService
  ) {}

  ngOnInit() {
    this.showStartButton = !this.registrationService.isStarted();
  }

  startRegistration() {
    this.registrationService.start();
    this.showStartButton = false;
    this.router.navigate(['personal-info'], { relativeTo: this.activatedRoute });
  }
}