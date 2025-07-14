import { Component, OnInit, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
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
import {MatExpansionModule} from '@angular/material/expansion';// Import a placeholder service

import { TipoPersona } from '../../../../interfaces/interface.tipopersona';
import { forkJoin } from 'rxjs';
import { CatalogosService } from '../../../../services/catalogos.service';
import { Escolaridad } from '../../../../models/escolaridad.model';
import { Nacionalidad } from '../../../../models/nacionalidad.model';
import { Sexo } from '../../../../models/genero.model';
import { AuthService } from '../../../../services/auth.service';
import { AppRegex } from '../../../../shared/validators/regex';
import { CatalogoItem } from '../../../../interfaces/interface.catalogoitem';
import { DireccionComponent } from '../direccion/direccion.component';
import { PersonaComponent } from '../persona/persona.component';

import {FormUtils} from '../../../../shared/utils/form-utils';
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
    MatCheckboxModule,
    MatExpansionModule,
    DireccionComponent,
    PersonaComponent
     // Assuming this is the correct import for the Domicilio component
  ],
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss'
})
export class SolicitanteComponent implements OnInit, OnChanges {
  @Input() precapturaPersonaID: string | null = null;
  @Input() tipoPersona: string;



  solicitanteForm!: FormGroup;
  isEditMode = false; // Flag to control form editability and button visibility
  isLoading = false; // Flag for loading state
  escolaridades: CatalogoItem[] = [];
  nacionalidades: CatalogoItem[] = [];
  generos: CatalogoItem[] = [];
  civil: CatalogoItem[] = [];
  gruposv: CatalogoItem[] = [];
  identifs:CatalogoItem[] = [];
  codigoPostals: CatalogoItem[] = [];
  catalogosCargados = false;

  // We will use PrecapturaPersona as the main model
  // The local SolicitanteData interface might be removed or merged later if not needed.
  private _authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private _catalogosService = inject(CatalogosService);
  private _precapturaService = inject(PrecapturaPersonaService);

  formUtils = FormUtils;

  selectedPersonTypeId: number | null = null;


  internalPersonTypes: TipoPersona[] = [
    { id: 1, nombre: 'Persona física' },
    { id: 2, nombre: 'Persona moral' }
  ];

  selectedInternalPersonType: TipoPersona = this.internalPersonTypes[0];

  constructor() {}

  ngOnInit() {
    console.log('Desde ngOnInit:', this.tipoPersona);
    if (this.tipoPersona==='Soy trabajador') this.selectedPersonTypeId = 1;
    this.initForms(); // Initialize the form group first and synchronously
    this.loadDataOrEnableForm(); // Asynchronous data loading
    this.updateInternalPersonTypeLogic(); // Sets initial value and validators for internalPersonTypeId, CURP/RFC
    this.loadCatalogs(); // Asynchronous catalog loading

  }

  ngOnChanges(changes: SimpleChanges) {
   if (!this.solicitanteForm) {
      return; // Exit if the form is not yet ready
    }

    if (changes['precapturaPersonaID']) {
      this.loadDataOrEnableForm();
    }
    // Only call updateInternalPersonTypeLogic if tipoPersona input actually changed
    // The previous check (&& changes['tipoPersona'].currentValue !== changes['tipoPersona'].previousValue) is good practice,
    // you can re-enable it if needed.
    if (changes['tipoPersona']) {
        console.log('ngOnChanges: tipoPersona detected a change.'); // This should always log if a change is detected
      if (changes['tipoPersona'].currentValue !== changes['tipoPersona'].previousValue) {
          console.log('ngOnChanges: tipoPersona actual value change:', this.tipoPersona);
          this.updateInternalPersonTypeLogic();
      } else {
          console.log('ngOnChanges: tipoPersona value is the same as before.');
      }
    }
  }

  getPersonTypeIcon(): string {
    return this.selectedInternalPersonType.nombre === 'Física' ? 'person' : 'business';
  }

  selectPersonType(typeId: number) {
    this.selectedPersonTypeId = typeId;

    // Actualizar el FormControl si usas Reactive Forms
    this.solicitanteForm.get('internalPersonTypeId')?.setValue(typeId);

    // Llamar al método original si lo necesitas
    this.onInternalPersonTypeChange(typeId);
  }





  initForms() {
    this.solicitanteForm = this.fb.group({
     internalPersonTypeId: [this.selectedInternalPersonType.id],
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required], // Changed from apellidoPaterno
      segundoApellido: [''], // Changed from apellidoMaterno, optional
      telefonoCel: ['', [Validators.required, Validators.pattern(AppRegex.TELEFONO)]], // Changed from telefono
      correo: ['', [Validators.required, , Validators.email, Validators.pattern(AppRegex.CORREO)]], // Changed from email
      // direccion: ['', Validators.required],
      // Fields from PrecapturaPersona
      curp: ['MOMD931207HBCRLN01', Validators.pattern(AppRegex.CURP)],
      rfc:['MOM931207132', Validators.pattern(AppRegex.RFC)],
      fechaNacimiento: ['', Validators.required],
      numeroIdentificacion: [''],
      generoID: [null],
      nombreOcupacion: [''],
      esRepProcurador: [false],
      tipoIdentificacionID: [null],
      nacionalidadID: [null],
      escolaridadID: [null],
      estadoCivilID: [null],
      ocupacionID: [null],
      grupoVulnerableID: [null]
    });

  }

  loadCatalogs() {
    // forkJoin recibe un objeto. Las claves son los nombres que tú elijas.
    forkJoin({
      escolaridadesRes: this._catalogosService.getEscolaridades(),
      nacionalidadesRes: this._catalogosService.getNacionalidades(),
      generosRes: this._catalogosService.getGeneros(),
      estadoCivilRes: this._catalogosService.getEstadoCivil(),
      gruposRes: this._catalogosService.getGrupoVulnerable(),
      identifRes: this._catalogosService.getTipoIdentificacion()
    }).subscribe({
      next: (resultados) => {
        // 'resultados' es un objeto con las respuestas, usando las claves que definiste.
        this.escolaridades = resultados.escolaridadesRes;
        this.nacionalidades = resultados.nacionalidadesRes;
        this.generos = resultados.generosRes;
        this.civil = resultados.estadoCivilRes;
        this.gruposv = resultados.gruposRes;
        this.identifs = resultados.identifRes;
        this.catalogosCargados = true; // Puedes usar esto para mostrar un spinner
        if (this._authService.userProfile()){
          this._precapturaService.getPrecapturaPersonaById(this._authService.userProfile().PrecapturaPersonaID).subscribe({
              next: (data) => {
                if (data) {
                  this.precapturaPersonaID = data.PrecapturaPersonaID; // Asignar el ID del perfil cargado
                  this.loadDataOrEnableForm(); // Cargar datos del perfil
                } else {
                  console.warn('No se encontró el perfil de usuario.');
                  this.solicitanteForm.enable(); // Habilitar formulario si no hay perfil
                }
              }
              ,
              error: (err) => {
                console.error('Error al cargar el perfil de usuario:', err);
                this.solicitanteForm.enable(); // Habilitar formulario en caso de error
              }
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar uno de los catálogos', err);
        // Importante: Si UNA de las peticiones falla, forkJoin falla por completo.
        // Aquí deberías mostrar un mensaje de error al usuario.
      }
    });
  }


  loadDataOrEnableForm() {
    if (this.precapturaPersonaID) {
      this.isLoading = true;
      this.isEditMode = false; // Initially, view mode
      this.solicitanteForm.disable();
      this._precapturaService.getPrecapturaPersonaById(this.precapturaPersonaID).subscribe({
        next: (data) => {
          if (data) {
            let loadedInternalTypeId = 1;
            this.solicitanteForm.patchValue({
              internalPersonTypeId:loadedInternalTypeId,
              nombre: data.nombre,
              primerApellido: data.primerApellido,
              segundoApellido: data.segundoApellido || '',
              telefonoCel: data.telefonoCel || '',
              correo: data.correo || '',
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


  toggleCurpRfcValidation(type: TipoPersona): void {
    const curpControl = this.solicitanteForm.get('curp');
    const rfcControl = this.solicitanteForm.get('rfc');

    if (type.nombre === 'Física') {
      // Set validators for CURP: REQUIRED + PATTERN
      curpControl?.setValidators([Validators.required, Validators.pattern(AppRegex.CURP)]);
      // Clear validators for RFC
      rfcControl?.clearValidators();
      rfcControl?.setValue('');
    } else if (type.nombre === 'Moral') {
      // Set validators for RFC: REQUIRED + PATTERN
      rfcControl?.setValidators([Validators.required, Validators.pattern(AppRegex.RFC)]);
      // Clear validators for CURP
      curpControl?.clearValidators();
      curpControl?.setValue('');
    }

    // Always call updateValueAndValidity to re-evaluate the control's validity
    curpControl?.updateValueAndValidity();
    rfcControl?.updateValueAndValidity();
  }
  isPatron(): boolean {
    return this.tipoPersona === 'Soy patron';
  }

  onInternalPersonTypeChange(selectedId: number): void {
    const selectedType = this.internalPersonTypes.find(type => type.id === selectedId);
    if (selectedType) {
      this.selectedInternalPersonType = selectedType;
      this.toggleCurpRfcValidation(selectedType);
    }
  }


  private updateInternalPersonTypeLogic(): void {
    const internalPersonTypeIdControl = this.solicitanteForm.get('internalPersonTypeId');

    if (this.isPatron()) {
      // If 'Soy patron', default to Moral (ID 2) as per previous implicit logic for RFC showing initially
      // Or default to Física (ID 1) if that's the intended initial state for Patrones
      internalPersonTypeIdControl?.enable();
      this.selectedInternalPersonType = this.internalPersonTypes.find(t => t.id === 2) || this.internalPersonTypes[0]; // Default to Moral if found, else Física
    } else {
      // If NOT 'Soy patron' (e.g., 'Soy trabajador'), force to Física (ID 1)
      internalPersonTypeIdControl?.disable();
      this.selectedInternalPersonType = this.internalPersonTypes.find(t => t.id === 1) || this.internalPersonTypes[0]; // Force to Física
    }
    // Set the form control value immediately
    this.solicitanteForm.get('internalPersonTypeId')?.setValue(this.selectedInternalPersonType.id, { emitEvent: false });
    // Apply validations based on the now set selectedInternalPersonType
    this.toggleCurpRfcValidation(this.selectedInternalPersonType);


  }


  get shouldShowCurp(): boolean {
    return this.selectedInternalPersonType.nombre === 'Física';
  }

  get shouldShowRfc(): boolean {
    return this.selectedInternalPersonType.nombre === 'Moral';
  }


}
