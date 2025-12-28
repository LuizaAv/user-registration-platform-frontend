import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { personalInfoReducer } from './registration/store/personal-info/personal-info.reducer';
import { professionalInfoReducer } from './registration/store/professional-info/professional-info.reducer';
import { preferencesReducer } from './registration/store/preferences/preferences.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideStore({ 
      personalInfo: personalInfoReducer,
      professionalInfo: professionalInfoReducer,
      preferences: preferencesReducer
    }),
    provideEffects([]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ],
  // providers: [
  //   provideBrowserGlobalErrorListeners(),
  //   provideRouter(routes), provideClientHydration(withEventReplay())
  // ]
};
