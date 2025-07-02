import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { provideNativeDateAdapter } from '@angular/material/core';
import { withInterceptors ,HTTP_INTERCEPTORS } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { LoaderInterceptor } from './services/loader-interceptor';



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
     importProvidersFrom(ToastrModule.forRoot({
      timeOut: 3000, // Duración de la notificación en milisegundos
      positionClass: 'toast-top-right', // Posición de las notificaciones
      preventDuplicates: true, // Evitar notificaciones duplicadas
      closeButton: true, // Mostrar botón para cerrar la notificación
      progressBar: true, // Mostrar barra de progreso
    })), // Agrega ToastrModule aquí
    provideNativeDateAdapter(),


    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }, // Añade el interceptor

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

