import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PrecapturaPersona } from '../../../../models/persona.model';

/* Contantes quitar TODO */
export interface SolicitanteData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  direccion: string;


}


@Component({
  selector: 'app-solicitante',
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
    MatCheckboxModule
  ],
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss'
})
export class SolicitanteComponent implements OnInit {
    precapturaPersona?: PrecapturaPersona;
    solicitanteForm!: FormGroup;
    solicitante: SolicitanteData = {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        email: '',
        direccion: ''
    };

    constructor(
      private fb: FormBuilder
    ) {}
    // Puedes usar el tipado PrecapturaPersona como tipo en propiedades o métodos.
    // Por ejemplo, puedes declarar una propiedad opcional:
  ngOnInit() {
    this.initForms();
  }


  initForms() {
      this.solicitanteForm = new FormBuilder().group({
        nombre: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: ['', Validators.required],
        telefono: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        direccion: ['', Validators.required]
      });
    }

    guardarSolicitante() {
    if (this.solicitanteForm.valid) {
      this.solicitante = this.solicitanteForm.value;
      console.log('Datos del solicitante guardados:', this.solicitante);
      //TODO steper
    }
  }

}
