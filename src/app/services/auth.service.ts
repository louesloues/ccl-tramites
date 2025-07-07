import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { StorageService } from './storage.service';
import { Token } from '../types/token';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { LoginResponse } from '../interfaces/login-response';
import { PrecapturaPersona } from '../models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyección de dependencias moderna con inject()
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);

  // APIs
  private baseUrl = environment.apiUrl;
  private baseUrlOld = environment.apiUrlOld;
  private headers = new HttpHeaders();

  // ===============================================================
  // MANEJO DE ESTADO CON SIGNALS
  // ===============================================================

  // 1. El 'signal' es la fuente de verdad para el token.
  //    Se inicializa desde el storage para mantener la sesión.
  readonly authToken = signal<string | null>(this.getTokenFromStorage());
  readonly userProfile = signal<PrecapturaPersona | null>(null);

  // 2. El 'computed' es un valor derivado. Reacciona automáticamente
  //    a los cambios en `authToken`. No necesita actualización manual.
  readonly isLoggedIn = computed<boolean>(() => !!this.authToken());

  constructor() {
    // 3. (Opcional) Un 'effect' para reaccionar a cambios en el estado.
    //    Útil para debugging o lógica que debe ejecutarse cuando cambia el estado.
    effect(() => {
      console.log(`El estado de autenticación cambió: ${this.isLoggedIn() ? 'Logueado' : 'Deslogueado'}`);
      // Podrías incluso manejar redirecciones globales aquí si quisieras.
    });
  }

  // ===============================================================
  // MÉTODOS DE AUTENTICACIÓN (Lógica principal sin cambios)
  // ===============================================================

  login(Usr: string, Psw: string, Auth: boolean): Observable<ApiResponse<LoginResponse>> {
    const body = { Usr, Psw, Auth, urlOrigin: '' };

    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}UsuarioWeb/LoginWebCCL/`, body, { headers: this.headers })
      .pipe(
        // Usamos switchMap para encadenar la siguiente acción.
        switchMap(loginResponse => {
          // Si el login NO fue exitoso, o no hay ID, simplemente devolvemos la respuesta original.
          if (!loginResponse.success) {
            console.warn('Login fallido o sin ID de usuario. Respuesta original:', loginResponse);
            return of(loginResponse); // 'of' crea un observable que emite el valor y se completa.
          }

          // Si hay ID, preparamos la sesión y DISPARAMOS la carga de datos del perfil.
          const token_new: Token = {
            id: loginResponse.data.token,
            PrecapturaPersonaID: loginResponse.data.precapturaPersonaID,
            usuarioID: loginResponse.data.usuarioID,
            correo: loginResponse.data.usr
          };
          this.setSessionInfo(token_new);

          if (!loginResponse.data.precapturaPersonaID) {
            console.warn('Usuario no tiene PrecapturaPersonaID. Redirigiendo a completar registro.');
            // Si no hay PrecapturaPersonaID, redirigimos al usuario a completar su registro.
            this.router.navigate(['/tramiteonline/completar-registro']);
            return of(loginResponse); // Retornamos la respuesta original.
          }



          // Llamamos a un nuevo método para cargar el perfil y lo retornamos.
          // switchMap espera que retornemos un Observable.
          console.log(`Login exitoso. Cargando perfil de usuario con ID: ${loginResponse.data.precapturaPersonaID}`);
          return this.fetchAndSetUserProfile(loginResponse.data.precapturaPersonaID).pipe(
             // Cuando fetchAndSetUserProfile termine, retornamos la respuesta del login original
             // para que el componente que se suscribió la reciba.
            map(() => loginResponse)
          );
        })
      );
}


  private fetchAndSetUserProfile(personaID: string): Observable<PrecapturaPersona> {
    console.log(`Cargando perfil de usuario con ID: ${personaID}`);
  return this.http.get<ApiResponse<PrecapturaPersona>>(`${this.baseUrl}PrecapturaPersona/${personaID}`).pipe(
    map(response => {
      // Verificamos que la petición fue exitosa y que la propiedad 'data' existe.
      if (response.success && response.data) {
        // Guardamos únicamente la parte de 'data' (el perfil) en nuestra signal.
        this.userProfile.set(response.data);
        console.log('Perfil de usuario cargado y guardado en el estado.');
      }
      // Retornamos solo la información del perfil (response.data) para que el
      // observable que se suscriba reciba el objeto PrecapturaPersona directamente.
      return response.data;
    })
  );
}

  logout(): void {
    console.log('AuthService logout');
    // Limpiamos el storage
    this.storage.removeItem('ccl:token');
    this.storage.removeItem('ccl:personaID');
    this.storage.removeItem('ccl:usuarioID');
    this.storage.removeItem('ccl:correo');
    this.authToken.set(null);
    // Actualizamos el signal, lo que automáticamente actualizará `isLoggedIn`.
    this.authToken.set(null);

    this.router.navigate(['/']);
  }

  addUser(Correo:string, Psw:string) {
    const body = {
      Nombre: 'online',
      PrimerApellido: 'online',
      SegundoApellido: 'online',
      Correo,
      Usr: Correo,
      Psw,
      RolID: 0,
      SedeID: 0,
      TipoPersonaID: 1,
      Activo: false,
      Auth: false,
      PrecapturaPersonaID: null
    };
    return this.http.post(`${this.baseUrl}UsuarioWeb`, body, { headers: this.headers });
  }

  validateUser(tokenAutentifica:string) {
    return this.http.get(`${this.baseUrl}UsuarioWeb/ValidaEmail/${tokenAutentifica}`, { headers: this.headers });
  }

  forgotPassApi(clave:string) {
    return this.http.get(`${this.baseUrlOld}Buzon/v1/GetBuzonByUsuario/${clave}`);
  }

  // ===============================================================
  // MÉTODOS AUXILIARES (Helpers para manejar el storage)
  // ===============================================================

  private getTokenFromStorage(): string | null {
    try {
      // Directamente obtenemos el token. Si no existe, devuelve null.
      return JSON.parse(this.storage.getItem('ccl:token'));
    } catch (e) {
      return null;
    }
  }

  public getUserFromStorage(): string | null {
    try {
      // Directamente obtenemos el token. Si no existe, devuelve null.
      return JSON.parse(this.storage.getItem('ccl:correo'));
    } catch (e) {
      return null;
    }
  }

  private setSessionInfo(token: Token): void {
    try {
      this.storage.setItem('ccl:token', JSON.stringify(token.id));
      this.storage.setItem('ccl:personaID', JSON.stringify(token.PrecapturaPersonaID));
      this.storage.setItem('ccl:usuarioID', JSON.stringify(token.usuarioID));
      this.storage.setItem('ccl:correo', JSON.stringify(token.correo));

      // ¡El cambio clave! Actualizamos el signal con el nuevo token.
      this.authToken.set(token.id);

    } catch (e) {
      console.error("Error al guardar la sesión en storage: ", e);
    }
  }
}
