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
import { SolicitanteComponent } from "../../components/solicitante/solicitante.component";
import { PrecapturaPersona } from '../../../../models/persona.model';




export interface SolicitudData {
  tipoSolicitud: string;
  motivo: string;
  fechaSolicitud: Date;
  prioridad: string;
  observaciones: string;
}

export interface CitadoData {
  nombreCitado: string;
  apellidoPaternoCitado: string;
  apellidoMaternoCitado: string;
  telefonoCitado: string;
  emailCitado: string;
  direccionCitado: string;
  relacion: string;
}

/* Quitar TODO */

@Component({
  selector: 'app-solicitudes',
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
    SolicitanteComponent
],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {

  solicitanteForm!: FormGroup;
  solicitudForm!: FormGroup;
  citadoForm!: FormGroup;

  datosCompletos = {
    solicitante: {} as PrecapturaPersona,
    solicitud: {} as SolicitudData,
    citado: {} as CitadoData
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.solicitanteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required]
    });

    this.solicitudForm = this.fb.group({
      tipoSolicitud: ['', Validators.required],
      motivo: ['', Validators.required],
      fechaSolicitud: ['', Validators.required],
      prioridad: ['', Validators.required],
      observaciones: ['']
    });

    this.citadoForm = this.fb.group({
      nombreCitado: ['', Validators.required],
      apellidoPaternoCitado: ['', Validators.required],
      apellidoMaternoCitado: ['', Validators.required],
      telefonoCitado: ['', Validators.required],
      emailCitado: ['', [Validators.required, Validators.email]],
      direccionCitado: ['', Validators.required],
      relacion: ['', Validators.required]
    });
  }



  guardarSolicitud() {
  //   if (this.solicitudForm.valid) {
  //     this.datosCompletos.solicitud = this.solicitudForm.value;
  //     console.log('Datos de la solicitud guardados:', this.datosCompletos.solicitud);
  //   }
  }

  guardarCitado() {
    if (this.citadoForm.valid) {
      this.datosCompletos.citado = this.citadoForm.value;
      console.log('Datos del citado guardados:', this.datosCompletos.citado);
    }
  }

  editarPaso(stepIndex: number) {
    // Implementar lógica para regresar al paso específico
    console.log(`Editando paso ${stepIndex}`);
  }

  enviarSolicitud() {
    console.log('Enviando solicitud completa:', this.datosCompletos);
    // Aquí implementarías la lógica para enviar los datos al backend
    alert('Solicitud enviada correctamente!');
  }

}
