import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { provideNativeDateAdapter } from '@angular/material/core';
import { withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // {provide:LOCALE_ID,'es-MX'},
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    // provideHttpClient(
    //   withInterceptors([authInterceptor)
    // )
    provideClientHydration(),
    provideAnimationsAsync('noop'),
    provideAnimationsAsync('noop'),
    provideNativeDateAdapter(),

  ]
};
function provideExperimentalZonelessChangeDetection(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

