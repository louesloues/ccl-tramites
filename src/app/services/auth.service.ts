import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, computed, WritableSignal, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { StorageService } from './storage.service';

// Se mantiene tu interfaz Token
export interface Token {
  id: string;
  usuarioID: number;
  correo: string;
  PrecapturaPersonaID: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // --- Inyección de Dependencias Moderna ---
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);

  // --- Estado Reactivo con Signals ---
  // El 'signal' se convierte en la única fuente de verdad para la información del usuario.
  public currentUser: WritableSignal<Token | null> = signal(this.getUserFromLocalStorage());
  
  // 'computed' crea un signal de solo lectura derivado de otro.
  // Reacciona automáticamente a los cambios en 'currentUser'.
  public isLoggedIn: Signal<boolean> = computed(() => !!this.currentUser());

  // --- Propiedades y Configuración ---
  public useMockData: boolean = true;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private baseUrl = environment.apiUrl;
  private baseUrlOld = environment.apiUrlOld;

  constructor() {
    // Escucha eventos de storage para sincronizar el estado entre pestañas.
    window.addEventListener('storage', (event) => {
      if (event.key === 'currentUser') {
        this.currentUser.set(this.getUserFromLocalStorage());
      }
    });
  }

  /**
   * Obtiene el usuario del localStorage. Es privado porque la lógica interna del servicio
   * es la única que debe realizar esta operación.
   */
  private getUserFromLocalStorage(): Token | null {
    try {
      const userJson = this.storage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error("Error al parsear el usuario desde localStorage", e);
      return null;
    }
  }

  /**
   * Centraliza la lógica para guardar la sesión.
   * Actualiza tanto el localStorage como el signal.
   * @param token El objeto Token recibido del login.
   */
  private setSession(token: Token): void {
    try {
      this.storage.setItem('currentUser', JSON.stringify(token));
      // Esta es la línea clave: actualiza el signal, lo que notificará
      // a toda la aplicación (como el Header) que el estado ha cambiado.
      this.currentUser.set(token);
    } catch (e) {
      console.error("Error al guardar la sesión", e);
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    console.log('AuthService: Cerrando sesión');
    this.storage.removeItem('currentUser');
    this.currentUser.set(null); // La UI reaccionará a este cambio.
    this.router.navigate(['/login']);
  }

  /**
   * Realiza el proceso de login. La firma del método no cambia, sigue devolviendo un Observable.
   * Usamos el operador `tap` para actualizar el estado del servicio como un "efecto secundario".
   */
  login(Usr: string, Psw: string, Auth: boolean): Observable<any> {
    if (this.useMockData) {
      console.log('AuthService login: Usando datos mock');
      const mockResponse: Token = {
        id: 'mock-jwt-token-12345',
        usuarioID: 123,
        correo: Usr,
        PrecapturaPersonaID: 'mock-precaptura-id-54321'
      };
      
      return new Observable(observer => {
        setTimeout(() => {
          this.setSession(mockResponse); // Actualizamos estado y storage
          observer.next({ success: true, message: 'Éxito', data: mockResponse });
          observer.complete();
        }, 500);
      });
    } else {
      const body = { Usr, Psw, Auth, urlOrigin: '' };
      return this.http.post<Token>(`${this.baseUrl}UsuarioWeb/LoginWebCCL/`, body, { headers: this.headers }).pipe(
        tap(responseToken => {
          // 'tap' nos permite ejecutar código cuando el Observable emite un valor,
          // sin modificar el valor en sí. Aquí es donde actualizamos el estado.
          if (responseToken && responseToken.id) {
            this.setSession(responseToken);
          }
        })
      );
    }
  }

  // --- Tus otros métodos se mantienen igual, ya que no gestionan el estado principal ---

  addUser(Correo: string, Psw: string) {
    const body = {
      Nombre: 'online', PrimerApellido: 'online', SegundoApellido: 'online',
      Correo, Usr: Correo, Psw, RolID: 0, SedeID: 0, TipoPersonaID: 1,
      Activo: false, Auth: false, PrecapturaPersonaID: null
    };
    return this.http.post(`${this.baseUrl}UsuarioWeb`, body, { headers: this.headers });
  }

  validateUser(tokenAutentifica: string) {
    return this.http.get(`${this.baseUrl}UsuarioWeb/ValidaEmail/${tokenAutentifica}`, { headers: this.headers });
  }

  forgotPassApi(clave: string) {
    return this.http.get(`${this.baseUrlOld}Buzon/v1/GetBuzonByUsuario/${clave}`);
  }
}
