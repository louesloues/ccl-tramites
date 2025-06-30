import { Routes } from '@angular/router';
import { SolicitudesComponent } from './modules/solicitud/pages/solicitudes/solicitudes.component';
import { StepperComponent } from './modules/solicitud/components/stepper/stepper.component';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { Component } from '@angular/core';

export const routes: Routes = [
   // Ruta por defecto: Redirige la ruta vacía a '/solicitud'
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'solicitud',
    component: SolicitudesComponent,
    data: { breadcrumb: 'Solicitud' }
  },
  {
    path: 'ratificacion',
    component: SolicitudesComponent,
    data: { breadcrumb: 'Ratificación' }
    // Aquí, si 'RatificacionesComponent' es diferente, deberías importarlo y usarlo.
  },
  // Si tuvieras rutas para Online y Buzón que requieren login:

  {
    path: 'buzon',
    // component: BuzonComponent, // Reemplazar con el componente real de Buzón
    component:LoginComponent,
    // canActivate: [AuthGuard],
    data: { breadcrumb: 'Buzón' }
  },
  {
    path: 'tramiteonline',
    component: LoginComponent, // Reemplazar con el componente real de Trámite Online
    // canActivate: [AuthGuard],
    data: { breadcrumb: 'Trámite Online' }
  },

  // Ruta comodín: Si ninguna de las rutas anteriores coincide, redirige a '/solicitud'
  {
    path: '**',
    component: NotfoundComponent,
    data: { breadcrumb: 'Pagina no encotrada' }
   }
];
