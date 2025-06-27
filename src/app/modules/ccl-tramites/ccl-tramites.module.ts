import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CclTramitesRoutingModule } from './ccl-tramites-routing.module';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { StepperComponent } from './components/stepper/stepper.component';


@NgModule({
  declarations: [
    SolicitudesComponent,
    StepperComponent
  ],
  imports: [
    CommonModule,
    CclTramitesRoutingModule
  ]
})
export class CclTramitesModule { }
