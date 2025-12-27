import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { personalInfoReducer } from './registration/store/personal-info/personal-info.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ personalInfo: personalInfoReducer }),
    provideEffects([]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
  // providers: [
  //   provideBrowserGlobalErrorListeners(),
  //   provideRouter(routes), provideClientHydration(withEventReplay())
  // ]
};
