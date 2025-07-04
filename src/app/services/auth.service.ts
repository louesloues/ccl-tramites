import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../types/token';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { StorageService } from './storage.service';
import { UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private headers = new HttpHeaders();
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  // Podrías almacenar el token en localStorage o sessionStorage
  private readonly TOKEN_NAME = 'authToken';
  private token: Token = new Token();
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  private baseUrl = environment.apiUrl;
  private baseUrlOld = environment.apiUrlOld;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: StorageService,
  )
  {

    let token = null;
    try {
      token = this.getToken();
    } catch (e) {}
    this.tokenSubject.next(token);

  }

  getTokenObs() {
    return this.tokenSubject.asObservable();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentToken(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_NAME);
  }

  login(Usr: string, Psw: string, Auth:boolean): Observable<any> { // Debería devolver un tipo más específico
    const body = {
      Usr,
      Psw,
      Auth,
      urlOrigin:''
    };

    return this.http
      .post(`${this.baseUrl}UsuarioWeb/LoginWebCCL/`, body, {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          this.token = <Token>res;
          // this.account = <Account>this.token.user;
          return this.setSessionInfo(this.token);
        })
      );
  }

  addUser(Correo:string,Psw:string){
    // Construir el objeto UsuarioWeb
    const body = {
        Nombre: 'online' ,
        PrimerApellido: 'online',
        SegundoApellido: 'online', // Asegurarse de que sea null si no hay valor
        Correo,
        Usr: Correo,
        Psw,
        RolID: 0,
        SedeID: 0,
        TipoPersonaID:1,
        Activo:false,
        Auth:false,
        PrecapturaPersonaID:null
    };

    return this.http.post(`${this.baseUrl}UsuarioWeb`, body, {
        headers: this.headers,
      });
  }

  validateUser(tokenAutentifica:string){
    return this.http.get(`${this.baseUrl}UsuarioWeb/ValidaEmail/${tokenAutentifica}`, {
      headers: this.headers});
  }



  forgotPassApi(clave:string){
    return this.http.get(`${this.baseUrlOld}Buzon/v1/GetBuzonByUsuario/${clave}`);
  }


  register(userData: any): Observable<any> { // Debería devolver un tipo más específico
    // Lógica de registro simulada
    console.log('AuthService register:', userData);
    // Simular una respuesta exitosa
    return new Observable(observer => {
      setTimeout(() => {
        // Podrías simular guardar el usuario y luego loguearlo, o redirigir al login
        localStorage.setItem(this.TOKEN_NAME, 'fake-jwt-token-จากการ-register'); // Simula guardar un token
        this.loggedIn.next(true);
        observer.next({ success: true, message: 'Registro exitoso' });
        observer.complete();
        this.router.navigate(['/']); // Redirigir después del registro
      }, 1000);
    });
  }

  logout(): void {
    console.log('AuthService logout');
    localStorage.removeItem(this.TOKEN_NAME);
    this.loggedIn.next(false);
    this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
  }

  /* Pinguino */
   getToken() {
    let token;
    try {
      token = JSON.parse(this.storage.getItem('ccl:token'));
    } catch (e) {}
    return token;
  }

  isValidSession() {
    return !!this.getToken();
  }

  setSessionInfo(token: Token): Token {
    try {
      this.storage.setItem('ccl:token', JSON.stringify(token.id));
      this.storage.setItem('ccl:personaID', JSON.stringify(token.PrecapturaPersonaID));
      this.storage.setItem('ccl:usuarioID', JSON.stringify(token.usuarioID));
    } catch (e) {
      console.log("Error: ",e);
    }
    this.token = token;
    this.tokenSubject.next(this.token.id);
    return this.token;
  }
}
