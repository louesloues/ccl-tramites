import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs'; // Asegúrate de importar 'of'
import { catchError, tap } from 'rxjs/operators';
// import { environment } from '../../environments/environment';
import { PrecapturaPersona } from '../models/persona.model'; // Ajusta la ruta si es necesario
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SolicitanteService {

   private http = inject(HttpClient);
   private apiUrl = `${environment.apiUrl}/precapturaPersonas`; // Ajusta el endpoint

  getPrecapturaPersonaByID(id: string | null): Observable<PrecapturaPersona | null> {
    if (!id) {
      // Considera si devolver un error o un observable de null es más apropiado aquí
      // return throwError(() => new Error('El PrecapturaPersonaID no puede ser nulo.'));
      return of(null); // Devuelve un observable de null si el ID es nulo
    }

    const url = `${this.apiUrl}/${id}`;
    return this.http.get<PrecapturaPersona>(url).pipe(
      tap(data => console.log('Datos de persona recibidos:', data)),
      catchError(this.handleError)
    );
  }

  // Aquí puedes añadir create, update, delete, etc.

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor (código ${error.status}): ${error.message}`;
      if (error.status === 404) {
        // Para 404, podrías querer que el observable emita null en lugar de error
        return of(null);
      }
    }
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
