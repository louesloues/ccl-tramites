import { Component, inject, OnInit } from '@angular/core';
import { CatalogosService } from '../../../../services/catalogos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { CatalogoItem } from '../../../../interfaces/interface.catalogoitem';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-busqueda-cp-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './busqueda-cp-dialog.component.html',
  styleUrl: './busqueda-cp-dialog.component.scss'
})
export class BusquedaCpDialogComponent implements OnInit {
  searchForm: FormGroup;
  estados:CatalogoItem[] = []; // Lista de estados
  municipios: CatalogoItem[] = []; // Lista de municipios
  colonias: CatalogoItem[] = []; // Lista de colonias
  resultados: any[] = []; // Para guardar los resultados de la búsqueda

  // Inyecta MatDialogRef para poder cerrar el diálogo
  private dialogRef = inject(MatDialogRef<BusquedaCpDialogComponent>);
  private fb = inject(FormBuilder);
  // Inyecta tu servicio
  private _direccionService = inject(CatalogosService);



  constructor() {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadCatalogs();

    // Optional: Load municipalities when a state is selected
    this.searchForm.get('estadoID')?.valueChanges.subscribe(estadoId => {
      this.searchForm.get('municipioID')?.reset(); // Reset municipality on state change
      this.cargarMunicipios(estadoId);
    });
  }

  initForm(){
    this.searchForm = this.fb.group({
      estado: [''],
      municipio: [''],
      colonia: ['']
    });
  }

  loadCatalogs(){
    // Carga los estados, municipios y colonias desde el servicio
    this._direccionService.getEstados().subscribe(estados => {
      this.estados = estados;
    });

  }

  // Llama a este método al buscar
  buscarCodigoPostal() {
    const filtros = this.searchForm.value;
    // this.__direccionService.buscar(filtros).subscribe(data => {
    //   this.resultados = data;
    // });
  }

  // Llama a este método al hacer clic en "Seleccionar" en un resultado
  seleccionar(direccionSeleccionada: any) {
    // Cierra el diálogo y devuelve la dirección completa
    this.dialogRef.close(direccionSeleccionada);
  }

  cargarMunicipios(estadoId: string): void {
    // This is where you would call your service to get municipalities for the selected state
    // this.catalogoService.getMunicipios(estadoId).subscribe(data => this.municipios = data);

    // --- Example Data ---
    if (estadoId === '11') {
      this.municipios = [
        { id: '020', nombre: 'León' },
        { id: '017', nombre: 'Guanajuato' },
        { id: '015', nombre: 'Irapuato' }
      ];
    } else {
      this.municipios = [];
    }
  }

}
