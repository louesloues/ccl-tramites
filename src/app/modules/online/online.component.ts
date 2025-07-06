import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStep, MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { SolicitanteComponent } from '../solicitud/components/solicitante/solicitante.component';
import { TipopersonaComponent } from './components/tipopersona/tipopersona.component';

@Component({
  selector: 'app-online',
  standalone: true,
  imports: [
      CommonModule,
         ReactiveFormsModule,
         MatStepperModule,
         MatButtonModule,
         MatFormFieldModule,
         MatInputModule,
         MatSelectModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatCardModule,
         MatIconModule,
         MatDividerModule,
         MatCheckboxModule,
         SolicitanteComponent,
         TipopersonaComponent
  ],
  templateUrl: './online.component.html',
  styleUrl: './online.component.scss'
})
export class OnlineComponent implements OnInit {
  selectedTipo: string = '';
  hasPendingTramites: boolean = false;
  pendingTramitesCount: number = 0;
  
  // FormGroups para cada step (puedes implementar validaciones)
  tipoPersonaForm: any;
  solicitanteForm: any;
  conflictoForm: any;
  citadoForm: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkPendingTramites();
  }

  selectTipoPersona(tipo: string) {
    this.selectedTipo = tipo;
  }

  continueToNext() {
    if (this.selectedTipo) {
      // Aquí puedes avanzar al siguiente step o navegar
      console.log('Continuando con tipo:', this.selectedTipo);
      // Para avanzar al siguiente paso: this.stepper.next();
    }
  }

  navigateToTramites() {
    this.router.navigate(['/mistramites']);
  }

  checkPendingTramites() {
    // Simulación de trámites pendientes
    this.hasPendingTramites = true;
    this.pendingTramitesCount = 3;
  }
}