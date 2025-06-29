import { Routes } from '@angular/router';
import { SolicitudesComponent } from './modules/ccl-tramites/pages/solicitudes/solicitudes.component';
import { StepperComponent } from './modules/ccl-tramites/components/stepper/stepper.component';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
   // Ruta por defecto: Redirige la ruta vacía a '/solicitud'
  {
    path: '',
    component: HomeComponent
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
  
  {
    path: 'online',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      // TODO { path: 'proceso', component: OnlineComponent }
    ]
  },
  {
    path: 'buzon',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      // TODO { path: 'proceso', component: BuzonComponent }
    ]
  },
  
  // Ruta comodín: Si ninguna de las rutas anteriores coincide, redirige a '/solicitud'
  { path: '**', component: NotfoundComponent }
];
