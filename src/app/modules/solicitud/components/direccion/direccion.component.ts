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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AppRegex } from '../../../../shared/validators/regex';
import { CatalogoItem } from '../../../../interfaces/interface.catalogoitem';
import { CatalogosService } from '../../../../services/catalogos.service';
import { LoaderService } from '../../../../services/loader.service';
import { NotificationService } from '../../../../services/notification.service';
import { debounceTime, distinctUntilChanged, filter, forkJoin, Subject, switchMap, takeUntil , Observable, startWith, map} from 'rxjs';
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
    MatAutocompleteModule,
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
  estados: CatalogoItem[]=[];
  paises: CatalogoItem[]=[];
  municipios: CatalogoItem[]=[];
  tiposVialidad: CatalogoItem[] = [];
  filteredColonias!: Observable<string[]>;


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
    this.setupColoniaAutocomplete();
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
  setupColoniaAutocomplete(): void {
    // Para mayor seguridad, comprueba que el control existe antes de usarlo
    const coloniaControl = this.direccionForm.get('colonia');
    if (coloniaControl) {
      this.filteredColonias = coloniaControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterColonias(value || ''))
      );
    }
  }

  private _filterColonias(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.colonias.filter(colonia => colonia.toLowerCase().includes(filterValue));
  }

  loadCatalogs() {
      // forkJoin recibe un objeto. Las claves son los nombres que tú elijas.
      forkJoin({
        estadoRes: this._catalogosService.getEstados(),
        tipoVialidadRes: this._catalogosService.getTiposVialidad(),

      }).subscribe({
        next: (resultados) => {
          // 'resultados' es un objeto con las respuestas, usando las claves que definiste.
          this.estados = resultados.estadoRes || [];
          this.tiposVialidad = resultados.tipoVialidadRes || [];
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
              entidadID: resultado.entidadID,
              municipioID: resultado.municipioID,
              // También puedes rellenar colonia, etc.
              colonia: resultado.colonia
            });

            // Deshabilita los campos como se solicitó
            this.direccionForm.get('entidad')?.disable();
            this.direccionForm.get('municipio')?.disable();
          }
        });
      }


      colonias: string[] = [];

      // ... dentro de tu clase de componente

      onCpChange() {
        const cpControl = this.direccionForm.get('cp');

        // 1. Validar antes de llamar al servicio
        //    Verifica que el control sea válido y que el usuario haya interactuado con él.
        if (cpControl && cpControl.valid && cpControl.dirty) {

          const cpValue = cpControl.value;

          // 2. Llamar al servicio
          this._catalogosService.getCodigosPostales(cpValue).subscribe({
            next: (response) => {
              // 3. Procesar la respuesta
              console.log('Respuesta CP:', response);
              if (response && response.length > 0) {
                const data = response[0]; // Obtenemos el primer (y único) elemento

                console.log('Colonias encontradas:', data.colonias);

                // Asignamos la lista de colonias a nuestra variable local
                this.colonias = data.colonias;

                if (!this.municipios.some(m => m.id === data.municipioID)) {
                  this.municipios.push({ id: data.municipioID, nombre: data.municipio });
                }

                // Autocompletamos otros campos del formulario
                this.direccionForm.patchValue({
                  municipioID: data.municipioID, // Asegúrate que tu formGroup tenga estos controles
                  entidadID: data.cveEstado,
                  // ... otros campos que quieras autocompletar
                });

              } else {
                // Si el CP es válido pero no se encuentra, limpiamos los campos
                console.warn('Código postal no encontrado.');
                this.colonias = [];
                this.direccionForm.patchValue({
                  municipioID: '',
                  entidadID: '',
                  colonia: '' // Limpia también la colonia seleccionada
                });
              }
            },
            error: (err) => {
              console.error('Error al obtener el código postal:', err);
              // Aquí podrías mostrar una notificación de error al usuario
            }
          });

          // Marcar el control como "no sucio" para evitar llamadas repetidas si se vuelve a perder el foco
          cpControl.markAsPristine();
        }
      }

      private resetDireccionFields(): void {
        this.colonias = [];
        this.direccionForm.patchValue({
          entidadID: null,
          municipioID: null,
          colonia: ''
        });
        this.direccionForm.get('entidadID')?.enable();
        this.direccionForm.get('municipioID')?.enable();
      }

}

