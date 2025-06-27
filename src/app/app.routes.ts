import { Routes } from '@angular/router';
import { SolicitudesComponent } from './modules/ccl-tramites/pages/solicitudes/solicitudes.component';
import { StepperComponent } from './modules/ccl-tramites/components/stepper/stepper.component';

export const routes: Routes = [
   // Ruta por defecto: Redirige la ruta vacía a '/solicitud'
  {
    path: '',
    redirectTo: 'solicitud',
    pathMatch: 'full' // Asegura que la URL sea exactamente vacía
  },
  {
    path: 'solicitud',
    component: SolicitudesComponent
  },
  {
    path: 'ratificacion',
    component: SolicitudesComponent // Aquí, si 'RatificacionesComponent' es diferente, deberías importarlo y usarlo.
  },
  // Si tuvieras rutas para Online y Buzón que requieren login:
  /*
  {
    path: 'online',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'proceso', component: OnlineComponent }
    ]
  },
  {
    path: 'buzon',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'proceso', component: BuzonComponent }
    ]
  },
  */
  // Ruta comodín: Si ninguna de las rutas anteriores coincide, redirige a '/solicitud'
  {
    path: '**',
    redirectTo: 'solicitud'
  }
];
