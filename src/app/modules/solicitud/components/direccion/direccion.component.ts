import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { AppRegex } from '../../../../shared/validators/regex';
import { CatalogoItem } from '../../../../interfaces/interface.catalogoitem';
import { CatalogosService } from '../../../../services/catalogos.service';
import { LoaderService } from '../../../../services/loader.service';
import { NotificationService } from '../../../../services/notification.service';
import { debounceTime, distinctUntilChanged, filter, forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { BusquedaCpDialogComponent } from '../busqueda-cp-dialog/busqueda-cp-dialog.component';

@Component({
  selector:'app-direccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIcon,
    MatCheckboxModule
  ],
  templateUrl: './direccion.component.html',
  styleUrl: './direccion.component.scss'
})
export class DireccionComponent implements OnInit {
  isEditMode: boolean = true;
  catalogosCargados: boolean = false;
  direccionForm: FormGroup;
  estados:CatalogoItem[];
  paises: CatalogoItem[];
  municipios: CatalogoItem[];


  private destroy$ = new Subject<void>();


  private fb = inject(FormBuilder);
  private _catalogosService = inject(CatalogosService);
  private _loadService = inject(LoaderService);
  private _notificationService = inject(NotificationService);

  private dialog = inject(MatDialog);

  constructor() {
    // Initialization logic can go here if needed
  }

  ngOnInit() {
    this.initForm();
    this.loadCatalogs();
  }

  initForm() {
     this.direccionForm = this.fb.group({
        cp: ['', [Validators.required, Validators.pattern(AppRegex.CodigoPostal)]],
        calle: ['', [Validators.required, Validators.maxLength(100)]],
        numeroExterior: ['', [Validators.required, Validators.maxLength(10)]],
        numeroInterior: ['', [Validators.maxLength(10)]],
        colonia: ['', [Validators.required, Validators.maxLength(50)]],
        municipioID: ['', [Validators.required, Validators.maxLength(50)]],
        entidadID: ['', [Validators.required, Validators.maxLength(50)]],
        referenciaCalles: ['', [Validators.maxLength(100)]]
     });
  }


  loadCatalogs() {
      // forkJoin recibe un objeto. Las claves son los nombres que tú elijas.
      forkJoin({
        estadoRes: this._catalogosService.getEstados(),
      }).subscribe({
        next: (resultados) => {
          // 'resultados' es un objeto con las respuestas, usando las claves que definiste.
          this.estados = resultados.estadoRes;
        },
        error: (err) => {
          console.error('Error al cargar uno de los catálogos', err);
        }
      });
    }

     abrirDialogoBusqueda(): void {
        const dialogRef = this.dialog.open(BusquedaCpDialogComponent, {
          width: '700px',
          // Puedes deshabilitar que se cierre al hacer clic afuera
          disableClose: true
        });

        // Escucha el resultado cuando el diálogo se cierre
        dialogRef.afterClosed().subscribe(resultado => {
          // Si el usuario seleccionó un resultado en el diálogo
          if (resultado) {
            // Actualiza los valores del formulario con los datos recibidos
            this.direccionForm.patchValue({
              cp: resultado.codigoPostal,
              entidad: resultado.entidadID,
              municipio: resultado.municipioID,
              // También puedes rellenar colonia, etc.
              colonia: resultado.colonia
            });

            // Deshabilita los campos como se solicitó
            this.direccionForm.get('entidad')?.disable();
            this.direccionForm.get('municipio')?.disable();
          }
        });
      }


  public escucharCambiosCp(): void {
    const cpControl = this.direccionForm.get('cp');
    if (!cpControl) return;

    cpControl.valueChanges.pipe(
      // Wait for 300ms after the user stops typing
      debounceTime(300),
      // Only proceed if the value is new
      distinctUntilChanged(),
      // Only search if the length is exactly 5
      filter((cp: string) => cp && cp.length === 5),
      // Switch to the new service call, cancelling previous ones
      switchMap(cp => this._catalogosService.getCodigosPostales(cp)),
      // Ensure we unsubscribe when the component is destroyed
      takeUntil(this.destroy$)
    ).subscribe(resultado => {
      // The logic to update the form fields
      this.actualizarCamposConResultado(resultado);
    });
  }

  onCpBlur(): void {
    const cpControl = this.direccionForm.get('cp');
    // Check if the control is valid and has 5 characters
    if (cpControl?.valid && cpControl.value?.length === 5) {
      console.log('Buscando por CP al perder el foco...');
      // this.direccionService.buscarPorCp(cpControl.value).subscribe(resultado => {
      //   this.actualizarCamposConResultado(resultado);
      // });
    }
  }

  private actualizarCamposConResultado(resultado: any): void {
    if (resultado) {
      this.direccionForm.patchValue({
        // Map the result to your form fields
        entidad: resultado.entidadID,
        municipio: resultado.municipioID,
        colonia: resultado.colonia,
        calle: '' // Clear street so the user can type it
      });
      // Disable fields if needed
      this.direccionForm.get('entidad')?.disable();
      this.direccionForm.get('municipio')?.disable();
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

