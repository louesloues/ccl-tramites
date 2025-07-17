import { Injectable } from '@angular/core';
import { PrecapturaEmpresa } from '../models/precpturaEmpresa';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecapturaEmpresaService {

  private mockEmpresas: PrecapturaEmpresa[] = [
    {
      precapturaEmpresaID: '1',
      rfc: 'XAXX010101000',
      razonSocial: 'Empresa Mock S.A. de C.V.',
      nombreComercial: 'Empresa Mock',
      regimenJuridicoID: 1,
      usuarioID: 1,
      ramaID: 1,
      giroID: 1,
      correo: 'contacto@empresamock.com',
      telefono: '5555555555',
      usuarioCaptura: 'admin',
      fechaCaptura: new Date(),
      usuarioModifico: '',
      fechaModifico: new Date(),
      activo: 1
    }
  ];

  constructor() { }

  getPrecapturaEmpresaById(id: string): Observable<PrecapturaEmpresa | undefined> {
    const empresa = this.mockEmpresas.find(e => e.precapturaEmpresaID === id);
    return of(empresa).pipe(delay(500));
  }

  createPrecapturaEmpresa(empresaData: Omit<PrecapturaEmpresa, 'precapturaEmpresaID' | 'fechaCaptura' | 'usuarioCaptura' | 'activo'>): Observable<PrecapturaEmpresa> {
    const newEmpresa: PrecapturaEmpresa = {
      ...empresaData,
      precapturaEmpresaID: Math.random().toString(36).substring(2, 15),
      fechaCaptura: new Date(),
      usuarioCaptura: 'currentUserMock',
      activo: 1,
    };
    this.mockEmpresas.push(newEmpresa);
    return of(newEmpresa).pipe(delay(500));
  }

  updatePrecapturaEmpresa(id: string, empresaData: Partial<PrecapturaEmpresa>): Observable<PrecapturaEmpresa | undefined> {
    const index = this.mockEmpresas.findIndex(e => e.precapturaEmpresaID === id);
    if (index !== -1) {
      this.mockEmpresas[index] = { ...this.mockEmpresas[index], ...empresaData, fechaModifico: new Date(), usuarioModifico: 'currentUserMock' };
      return of(this.mockEmpresas[index]).pipe(delay(500));
    }
    return of(undefined).pipe(delay(500));
  }
}
