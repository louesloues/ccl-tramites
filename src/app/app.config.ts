import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { provideNativeDateAdapter } from '@angular/material/core';
import { withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';



export const appConfig: ApplicationConfig = {
  providers: [
    // {provide:LOCALE_ID,'es-MX'},
    // provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    // provideHttpClient(
    //   withInterceptors([authInterceptor)
    // )
    provideClientHydration(),
    provideAnimationsAsync('noop'),
    provideNativeDateAdapter(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({
                  projectId:"ccl-login-afc54",
                  appId:"1:780161636507:web:4ac8b4595149d588964e3e",
                  storageBucket:"ccl-login-afc54.firebasestorage.app",
                  apiKey:"AIzaSyC98wrn8kOH6Y5FZQWaOWthAztWUs1P5xQ",
                  authDomain:"ccl-login-afc54.firebaseapp.com",
                  messagingSenderId:"780161636507"
                })),

    provideAuth(() => getAuth())
  ]
};

