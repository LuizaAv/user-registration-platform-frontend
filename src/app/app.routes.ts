import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { PersonalInfo } from './registration/pages/personal-info/personal-info';
import { Professional } from './registration/pages/professional/professional';
import { Preferences } from './registration/pages/preferences/preferences';
import { Verification } from './registration/pages/verification/verification';
import { Complete } from './registration/pages/complete/complete';
import { RegistrationGuard } from './guards/registration.guard';

export const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
    children: [
      { path: 'personal-info', component: PersonalInfo, canActivate: [RegistrationGuard] },
      { path: 'professional', component: Professional, canActivate: [RegistrationGuard] },
      { path: 'preferences', component: Preferences, canActivate: [RegistrationGuard] },
      { path: 'verification', component: Verification, canActivate: [RegistrationGuard] },
      { path: 'complete/:id', component: Complete, canActivate: [RegistrationGuard] },
    ],
  },
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
];
