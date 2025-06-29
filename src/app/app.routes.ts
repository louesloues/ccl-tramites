import { Routes } from '@angular/router';
import { SolicitudesComponent } from './modules/ccl-tramites/pages/solicitudes/solicitudes.component';
import { StepperComponent } from './modules/ccl-tramites/components/stepper/stepper.component';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
   // Ruta por defecto: Redirige la ruta vacía a '/solicitud'
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Regresar' }
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
    loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent), // Placeholder, reemplazar con el componente real
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Buzón' }
  },
  {
    path: 'tramiteonline',
    // component: TramiteOnlineComponent, // Reemplazar con el componente real de Trámite Online
    loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent), // Placeholder, reemplazar con el componente real
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Trámite Online' }
  },
  
  // Ruta comodín: Si ninguna de las rutas anteriores coincide, redirige a '/solicitud'
  { path: '**', component: NotfoundComponent }
];
