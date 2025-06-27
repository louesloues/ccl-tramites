import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';

const routes: Routes = [
  {
    path: 'solicitudes',
    component: SolicitudesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CclTramitesRoutingModule { }
