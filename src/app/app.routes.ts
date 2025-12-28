import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { PersonalInfo } from './registration/pages/personal-info/personal-info';
import { Professional } from './registration/pages/professional/professional';
import { Preferences } from './registration/pages/preferences/preferences';
import { Verification } from './registration/pages/verification/verification';
import { Complete } from './registration/pages/complete/complete';

export const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
    children: [
      { path: 'personal-info', component: PersonalInfo },
      { path: 'professional', component: Professional },
      { path: 'preferences', component: Preferences },
      { path: 'verification', component: Verification },
      { path: 'complete/:id', component: Complete },
    ],
  },
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
];
