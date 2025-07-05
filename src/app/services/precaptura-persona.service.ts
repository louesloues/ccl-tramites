import { Injectable } from '@angular/core';
import { PrecapturaPersona } from '../models/persona.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecapturaPersonaService {

   // Mock database of PrecapturaPersona
   private mockPersonas: PrecapturaPersona[] = [
    {
      PrecapturaPersonaID: '123',
      nombre: 'Juan Mock',
      primerApellido: 'Perez',
      segundoApellido: 'Gomez',
      curp: 'PERG850101HDFXXXA1', // Added A1 for uniqueness
      fechaNacimiento: '1985-01-01', // YYYY-MM-DD format
      correo: 'juan.perez@example.com',
      telefonoCel: '5512345678',
      usuarioID: 1, // System field
      numeroIdentificacion: 'INE123456789',
      generoID: 1, // Assuming 1: Masculino, 2: Femenino
      nombreOcupacion: 'Ingeniero de Software',
      esRepProcurador: false,
      usuarioCaptura: 'admin', // System field
      fechaCaptura: new Date(2023, 0, 15).toISOString(), // System field
      activo: true, // System field
      tipoIdentificacionID: 1, // Assuming 1: INE, 2: Pasaporte
      nacionalidadID: 1, // Assuming 1: Mexicana
      escolaridadID: 5, // Assuming e.g. 5: Licenciatura
      estadoCivilID: 2, // Assuming e.g. 2: Casado/a
      ocupacionID: 101, // Example Ocupacion ID
      grupoVulnerableID: 0 // Assuming 0: Ninguno
    },
    {
      PrecapturaPersonaID: '456',
      nombre: 'Maria Luisa Mock',
      primerApellido: 'Lopez',
      segundoApellido: 'Rodriguez', // Changed
      curp: 'LORL900202MDFXXXB2', // Added B2
      fechaNacimiento: '1990-02-20', // YYYY-MM-DD format, changed day
      correo: 'marialuisa.lopez@example.com', // Changed
      telefonoCel: '5587654321',
      usuarioID: 2, // System field
      numeroIdentificacion: 'PASMX67890123',
      generoID: 2,
      nombreOcupacion: 'Diseñadora Gráfica',
      esRepProcurador: true, // Changed
      usuarioCaptura: 'admin', // System field
      fechaCaptura: new Date(2023, 1, 10).toISOString(), // System field
      activo: true, // System field
      tipoIdentificacionID: 2,
      nacionalidadID: 1,
      escolaridadID: 6, // Assuming e.g. 6: Maestría
      estadoCivilID: 1, // Assuming e.g. 1: Soltero/a
      ocupacionID: 205, // Example Ocupacion ID
      grupoVulnerableID: 1 // Assuming 1: Adulto Mayor (example)
    }
  ];

  constructor() { }

  getPrecapturaPersonaById(id: string): Observable<PrecapturaPersona | undefined> {
    console.log(`PrecapturaService: Fetching persona with ID: ${id}`);
    const persona = this.mockPersonas.find(p => p.PrecapturaPersonaID === id);
    // Simulate network delay
    return of(persona).pipe(delay(500));
  }

  createPrecapturaPersona(personaData: Omit<PrecapturaPersona, 'PrecapturaPersonaID' | 'fechaCaptura' | 'usuarioCaptura' | 'activo'>): Observable<PrecapturaPersona> {
    console.log('PrecapturaService: Creating new persona with data:', personaData);
    const newPersona: PrecapturaPersona = {
      ...personaData,
      PrecapturaPersonaID: Math.random().toString(36).substring(2, 15), // Generate random ID
      fechaCaptura: new Date().toISOString(),
      usuarioCaptura: 'currentUserMock', // Mock current user
      activo: true,
      // Ensure all required fields have default or passed values
      segundoApellido: personaData.segundoApellido || '',
      curp: personaData.curp || '',
      correo: personaData.correo || '',
      telefonoCel: personaData.telefonoCel || '',
      numeroIdentificacion: personaData.numeroIdentificacion || '',
      nombreOcupacion: personaData.nombreOcupacion || '',
      esRepProcurador: personaData.esRepProcurador || false,
    };
    this.mockPersonas.push(newPersona);
    console.log('PrecapturaService: New persona created:', newPersona);
    return of(newPersona).pipe(delay(500));
  }

  updatePrecapturaPersona(id: string, personaData: Partial<PrecapturaPersona>): Observable<PrecapturaPersona | undefined> {
    console.log(`PrecapturaService: Updating persona with ID: ${id} with data:`, personaData);
    const index = this.mockPersonas.findIndex(p => p.PrecapturaPersonaID === id);
    if (index !== -1) {
      this.mockPersonas[index] = { ...this.mockPersonas[index], ...personaData, fechaModifico: new Date().toISOString(), usuarioModifico: 'currentUserMock' };
      console.log('PrecapturaService: Persona updated:', this.mockPersonas[index]);
      return of(this.mockPersonas[index]).pipe(delay(500));
    }
    console.warn(`PrecapturaService: Persona with ID ${id} not found for update.`);
    return of(undefined).pipe(delay(500));
  }
}
