import { Routes } from '@angular/router';
import { SolicitudesComponent } from './modules/solicitud/pages/solicitudes/solicitudes.component';
import { StepperComponent } from './modules/solicitud/components/stepper/stepper.component';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { Component } from '@angular/core';
import RegisterComponent from './modules/auth/register/register.component';


export const routes: Routes = [
   // Ruta por defecto: Redirige la ruta vacía a '/solicitud'
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'solicitud',
    loadComponent : ()=> import('./modules/solicitud/pages/solicitudes/solicitudes.component').then(c => c.SolicitudesComponent), // Asegúrate que el nombre y la ruta coincidan con tu archivo real
    data: { breadcrumb: 'Solicitud' }
  },
  {
    path: 'ratificacion',
    loadComponent:()=> import('./modules/ratificacion/ratificacion.component').then(c => c.default), // Asegúrate que el nombre y la ruta coincidan con tu archivo real
    data: { breadcrumb: 'Ratificación' }
    // Aquí, si 'RatificacionesComponent' es diferente, deberías importarlo y usarlo.
  },
  // Si tuvieras rutas para Online y Buzón que requieren login:

  // *** Configuración de Rutas Anidadas para 'buzon' ***
  {
    path: 'buzon', // Ruta padre para Buzón
    component: LoginComponent, // El componente principal para /buzon (puede ser un layout o el login mismo)
    data: { breadcrumb: 'Buzón' },
    children: [
      {
        path: '', // Redirige /buzon a /buzon/login
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login', // Ruta para el login de Buzón (ej. /buzon/login)
        loadComponent:()=>import('./modules/auth/login/login.component').then(c=>c.LoginComponent), // Usa LoginComponent para esta ruta
        data: { breadcrumb: 'Iniciar Sesión Buzón' }
      },
      {
        path: 'misnotificaciones', // Ruta para las notificaciones (ej. /buzon/misnotificaciones)
        loadComponent: ()=>import('./modules/buzon/buzon.component').then(c=>c.default) , // Componente que mostrará las notificaciones
        data: { breadcrumb: 'Mis Notificaciones' }
      }
      // Puedes añadir más rutas hijas aquí para Buzón si es necesario
    ]
  },
  {
    path: 'tramiteonline', // Ruta padre para Buzón
    component: LoginComponent, // El componente principal para /buzon (puede ser un layout o el login mismo)
    data: { breadcrumb: 'Tramite Online' },
    children: [
      {
        path: '', // Redirige /buzon a /buzon/login
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login', // Ruta para el login de Buzón (ej. /buzon/login)
        loadComponent:()=>import('./modules/auth/login/login.component').then(c=>c.LoginComponent) , // Usa LoginComponent para esta ruta
        data: { breadcrumb: 'Iniciar Sesión Buzón' }
      },
      {
        path: 'registro',
        loadComponent: ()=>import('./modules/auth/register/register.component').then(c=>c.default),
        data: { breadcrumb: 'Registro Tramite Online' }
      },
      {
        path: 'mitramite', // Ruta para las notificaciones (ej. /buzon/misnotificaciones)
        loadComponent: ()=>import('./modules/online/online.component').then(c=>c.OnlineComponent) , // Componente que mostrará las notificaciones
        data: { breadcrumb: 'Mis Notificaciones' }
      }
      // Puedes añadir más rutas hijas aquí para Buzón si es necesario
    ]
  },

  // Ruta comodín: Si ninguna de las rutas anteriores coincide, redirige a '/solicitud'
  {
    path: '**',
    component: NotfoundComponent,
    data: { breadcrumb: 'Pagina no encotrada' }
   }
];
