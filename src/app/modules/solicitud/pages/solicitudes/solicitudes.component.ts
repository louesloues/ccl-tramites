import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
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
import { environment } from '../../../../../environments/environment.development';


import { forkJoin } from 'rxjs';
import { CatalogosService } from '../../../../services/catalogos.service';
import { Escolaridad } from '../../../../models/escolaridad.model';
import { Nacionalidad } from '../../../../models/nacionalidad.model';
import { Sexo } from '../../../../models/genero.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';
import { LoaderService } from '../../../../services/loader.service';
import { TipoUsuario , TipoPersona } from '../../../../interfaces/interface.tipopersona';


import { TipopersonaComponent } from "../../../online/components/tipopersona/tipopersona.component";
import { SolicitanteComponent } from "../../components/solicitante/solicitante.component";

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
    SolicitanteComponent,
    TipopersonaComponent
  ],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  // Signals

  tipoPersonaSeleccionada = signal<string | null>(null);

  masterForm: FormGroup;
  solicitanteForm: FormGroup;
  solicitudForm: FormGroup;
  citadoForm: FormGroup;
  tipopersonaForm: FormGroup;



  datosCompletos = {
    tipopersona:{} as TipoUsuario,
    solicitante: {} as PrecapturaPersona,
    solicitud: {} as SolicitudData,
    citado: {} as CitadoData
  };

  // CORRECCIÓN: Usar la función inject() con 'i' minúscula.
  private _authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private _routerService = inject(Router);
  private _notificascionesServices = inject(NotificationService);
  private _loaderService = inject(LoaderService);
  constructor() {}

  ngOnInit() {
    this.initForms();
    this._loaderService.show();
    this._authService.login_tramites_usu(environment.usrOnline.Usr, environment.usrOnline.Psw, false).subscribe({
      next:(response) => {
        if (response['token']) {
          console.log('Login exitoso:', response['token']);
          this._loaderService.hide();
        } else {
          this._notificascionesServices.showError('Error al iniciar sesión. Reportar a CCL.','Error de inicio de sesión');
          this._routerService.navigate(['/']);
          this._loaderService.hide();
        }
      },
      error: (error) => {
        console.log('Error al realizar el login:', error);
        this._loaderService.hide();
      }
    });
  }

  initForms() {
    this.masterForm = this.fb.group({
      tipoPersonaSeleccionada: [null, Validators.required]
    });

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



  onTipoPersonaChange(tipo: string): void {
    console.log('tipo',tipo)
    this.masterForm.get('tipoPersonaSeleccionada')?.setValue(tipo);
    this.tipoPersonaSeleccionada.set(tipo);
    setTimeout(() => {
      this.stepper.next();
    }, 150);
    console.log('Tipo de persona seleccionado en el padre:', this.tipoPersonaSeleccionada());
    console.log('Estado del formulario:', this.masterForm.value);
  }

  guardarSolicitud() {
    // Implementar lógica
  }

  guardarCitado() {
    if (this.citadoForm.valid) {
      this.datosCompletos.citado = this.citadoForm.value;
      console.log('Datos del citado guardados:', this.datosCompletos.citado);
    }
  }

  editarPaso(stepIndex: number) {
    console.log(`Editando paso ${stepIndex}`);
  }

  enviarSolicitud() {
    console.log('Enviando solicitud completa:', this.datosCompletos);
    alert('Solicitud enviada correctamente!');
  }
}
