import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import { PrecapturaPersonaService } from '../../../../services/precaptura-persona.service';
// Import a placeholder service


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
export class SolicitanteComponent implements OnInit, OnChanges {
  @Input() precapturaPersonaID: string | null = null;

  solicitanteForm!: FormGroup;
  isEditMode = false; // Flag to control form editability and button visibility
  isLoading = false; // Flag for loading state

  // We will use PrecapturaPersona as the main model
  // The local SolicitanteData interface might be removed or merged later if not needed.

  constructor(
    private fb: FormBuilder,
    private _precapturaService: PrecapturaPersonaService // Inject the service
  ) {}

  ngOnInit() {
    this.initForms();
    // Initial check if ID is already provided (e.g. if component is initialized with it)
    this.loadDataOrEnableForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['precapturaPersonaID']) {
      this.loadDataOrEnableForm();
    }
  }

  initForms() {
    this.solicitanteForm = this.fb.group({
      // Aligning with PrecapturaPersona fields
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required], // Changed from apellidoPaterno
      segundoApellido: [''], // Changed from apellidoMaterno, optional
      telefonoCel: ['', Validators.required], // Changed from telefono
      correo: ['', [Validators.required, Validators.email]], // Changed from email
      // 'direccion' is not in PrecapturaPersona, we'll keep it for now.
      // It might need to be handled differently or removed if not part of the core model.
      direccion: ['', Validators.required], // Stays as a local form field, not in PrecapturaPersona mapping for load/save

      // Fields from PrecapturaPersona
      curp: [''], // Optional in model
      fechaNacimiento: ['', Validators.required], // Required in model
      numeroIdentificacion: [''], // Optional
      generoID: [null], // Optional number
      nombreOcupacion: [''], // Optional
      esRepProcurador: [false], // Optional boolean
      tipoIdentificacionID: [null], // Optional number
      nacionalidadID: [null], // Optional number
      escolaridadID: [null], // Optional number
      estadoCivilID: [null], // Optional number
      ocupacionID: [null], // Optional number
      grupoVulnerableID: [null] // Optional number
    });
    // By default, the form is for adding new, so it's enabled.
    // If an ID comes, loadDataOrEnableForm will disable it.
  }

  loadDataOrEnableForm() {
    if (this.precapturaPersonaID) {
      this.isLoading = true;
      this.isEditMode = false; // Initially, view mode
      this.solicitanteForm.disable();
      this._precapturaService.getPrecapturaPersonaById(this.precapturaPersonaID).subscribe({
        next: (data) => {
          if (data) {
            this.solicitanteForm.patchValue({
              nombre: data.nombre,
              primerApellido: data.primerApellido,
              segundoApellido: data.segundoApellido || '',
              telefonoCel: data.telefonoCel || '',
              correo: data.correo || '',
              // direccion: this.solicitanteForm.value.direccion, // Keep local value if any, or clear it

              curp: data.curp || '',
              fechaNacimiento: data.fechaNacimiento, // MatDatepicker should handle ISO string
              numeroIdentificacion: data.numeroIdentificacion || '',
              generoID: data.generoID === undefined ? null : data.generoID,
              nombreOcupacion: data.nombreOcupacion || '',
              esRepProcurador: data.esRepProcurador || false,
              tipoIdentificacionID: data.tipoIdentificacionID === undefined ? null : data.tipoIdentificacionID,
              nacionalidadID: data.nacionalidadID === undefined ? null : data.nacionalidadID,
              escolaridadID: data.escolaridadID === undefined ? null : data.escolaridadID,
              estadoCivilID: data.estadoCivilID === undefined ? null : data.estadoCivilID,
              ocupacionID: data.ocupacionID === undefined ? null : data.ocupacionID,
              grupoVulnerableID: data.grupoVulnerableID === undefined ? null : data.grupoVulnerableID
            });
            // Note: 'direccion' is intentionally not patched from 'data' as it's not part of PrecapturaPersona
          } else {
            // Handle case where ID is provided but no data is found
            console.warn(`No data found for PrecapturaPersonaID: ${this.precapturaPersonaID}`);
            this.solicitanteForm.enable(); // Allow adding new if not found? Or show error.
            this.precapturaPersonaID = null; // Clear ID
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching precaptura persona data:', err);
          this.isLoading = false;
          this.solicitanteForm.enable(); // Enable form on error to allow manual input
          this.precapturaPersonaID = null; // Clear ID
        }
      });
    } else {
      // No ID provided, enable form for new entry
      this.solicitanteForm.enable();
      this.solicitanteForm.reset(); // Clear form for new entry
      this.isEditMode = true; // Allow editing for a new entry
    }
  }

  enableEditMode() {
    this.isEditMode = true;
    this.solicitanteForm.enable();
  }

  guardarSolicitante() {
    if (this.solicitanteForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.solicitanteForm.markAllAsTouched();
      return;
    }

    const formData = this.solicitanteForm.value;
    console.log('Datos del solicitante:', formData);

    if (this.precapturaPersonaID) {
      // This is an update
      console.log('Updating existing solicitante with ID:', this.precapturaPersonaID);
      // Call update service method here
      // this.precapturaService.updatePrecapturaPersona(this.precapturaPersonaID, formData).subscribe(...);
    } else {
      // This is a new entry
      console.log('Saving new solicitante');
      // Call create service method here
      // this.precapturaService.createPrecapturaPersona(formData).subscribe(...);
    }
    // TODO: Handle stepper progression or other actions after save
  }
}
