import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin } from 'rxjs';

import { PrecapturaEmpresa } from '../../../../models/precpturaEmpresa';
import { PrecapturaEmpresaService } from '../../../../services/precaptura-empresa.service';
import { CatalogosService } from '../../../../services/catalogos.service';
import { CatalogoItem } from '../../../../interfaces/interface.catalogoitem';
import { AppRegex } from '../../../../shared/validators/regex';
import { FormUtils } from '../../../../shared/utils/form-utils';
import { TipoPersona } from '../../../../interfaces/interface.tipopersona';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit, OnChanges {
  @Input() precapturaEmpresaID: string | null = null;
  @Input() precapturaPersonaID: string | null = null;

  empresaForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  regimenesJuridicos: CatalogoItem[] = [];
  ramas: CatalogoItem[] = [];
  giros: CatalogoItem[] = [];
  catalogosCargados = false;
  tipoPersona:string = 'Persona moral';



  private fb = inject(FormBuilder);
  private _catalogosService = inject(CatalogosService);
  private _precapturaEmpresaService = inject(PrecapturaEmpresaService);

  formUtils = FormUtils;

  selectedPersonTypeId: number | null = null;

  internalPersonTypes: TipoPersona[] = [
    { id: 1, nombre: 'Persona física' },
    { id: 2, nombre: 'Persona moral' }
  ];

  selectedInternalPersonType: TipoPersona = this.internalPersonTypes[1];


  constructor() {}

  ngOnInit() {
    this.initForm();
    if (this.tipoPersona==='Soy trabajador') this.selectedPersonTypeId = 1;

    this.loadCatalogs();
    this.loadDataOrEnableForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['precapturaEmpresaID']) {
      this.loadDataOrEnableForm();
    }
  }

  initForm() {
    this.empresaForm = this.fb.group({
      internalPersonTypeId: [this.selectedInternalPersonType.id],
      rfc: ['', [Validators.required, Validators.pattern(AppRegex.RFC)]],
      razonSocial: ['', Validators.required],
      nombreComercial: ['', Validators.required],
      regimenJuridicoID: [null, Validators.required],
      ramaID: [null, Validators.required],
      giroID: [null, Validators.required],
      correo: ['', [Validators.required, Validators.email, Validators.pattern(AppRegex.CORREO)]],
      telefono: ['', [Validators.required, Validators.pattern(AppRegex.TELEFONO)]],
    });
  }

  loadCatalogs() {
    forkJoin({
      regimenes: this._catalogosService.getRegimenJuridico(),
      ramas: this._catalogosService.getRamas(),
      giros: this._catalogosService.getGiros(),
    }).subscribe({
      next: (resultados) => {
        this.regimenesJuridicos = resultados.regimenes;
        this.ramas = resultados.ramas;
        this.giros = resultados.giros;
        this.catalogosCargados = true;
      },
      error: (err) => {
        console.error('Error al cargar catálogos para empresa', err);
      }
    });
  }

  loadDataOrEnableForm() {
    if (this.precapturaEmpresaID) {
      this.isLoading = true;
      this.isEditMode = false;
      this.empresaForm.disable();
      this._precapturaEmpresaService.getPrecapturaEmpresaById(this.precapturaEmpresaID).subscribe({
        next: (data) => {
          if (data) {
            this.empresaForm.patchValue(data);
          } else {
            console.warn(`No data found for PrecapturaEmpresaID: ${this.precapturaEmpresaID}`);
            this.empresaForm.enable();
            this.precapturaEmpresaID = null;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching precaptura empresa data:', err);
          this.isLoading = false;
          this.empresaForm.enable();
          this.precapturaEmpresaID = null;
        }
      });
    } else {
      this.empresaForm.enable();
      this.empresaForm.reset();
      this.isEditMode = true;
    }
  }

  enableEditMode() {
    this.isEditMode = true;
    this.empresaForm.enable();
  }

  guardarEmpresa() {
    if (this.empresaForm.invalid) {
      this.empresaForm.markAllAsTouched();
      return;
    }

    const formData = this.empresaForm.value;

    if (this.precapturaEmpresaID) {
      this._precapturaEmpresaService.updatePrecapturaEmpresa(this.precapturaEmpresaID, formData).subscribe(() => {
        this.isEditMode = false;
        this.empresaForm.disable();
      });
    } else {
      this._precapturaEmpresaService.createPrecapturaEmpresa(formData).subscribe((newEmpresa) => {
        this.precapturaEmpresaID = newEmpresa.precapturaEmpresaID;
        this.isEditMode = false;
        this.empresaForm.disable();
      });
    }
  }


  onInternalPersonTypeChange(selectedId: number): void {
    const selectedType = this.internalPersonTypes.find(type => type.id === selectedId);
    if (selectedType) {
      this.selectedInternalPersonType = selectedType;
      this.toggleCurpRfcValidation(selectedType);
    }
  }


  private updateInternalPersonTypeLogic(): void {
    const internalPersonTypeIdControl = this.empresaForm.get('internalPersonTypeId');

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
    this.empresaForm.get('internalPersonTypeId')?.setValue(this.selectedInternalPersonType.id, { emitEvent: false });
    // Apply validations based on the now set selectedInternalPersonType
    this.toggleCurpRfcValidation(this.selectedInternalPersonType);

  }


   getPersonTypeIcon(): string {
    return this.selectedInternalPersonType.nombre === 'Física' ? 'person' : 'business';
  }

  selectPersonType(typeId: number) {
    this.selectedPersonTypeId = typeId;

    // Actualizar el FormControl si usas Reactive Forms
    this.empresaForm.get('internalPersonTypeId')?.setValue(typeId);

    // Llamar al método original si lo necesitas
    this.onInternalPersonTypeChange(typeId);
  }


  toggleCurpRfcValidation(type: TipoPersona): void {
    const curpControl = this.empresaForm.get('curp');
    const rfcControl = this.empresaForm.get('rfc');

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


  get shouldShowCurp(): boolean {
    return this.selectedInternalPersonType.nombre === 'Física';
  }

  get shouldShowRfc(): boolean {
    return this.selectedInternalPersonType.nombre === 'Moral';
  }


}


