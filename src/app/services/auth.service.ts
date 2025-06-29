import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  // Podrías almacenar el token en localStorage o sessionStorage
  private readonly TOKEN_NAME = 'authToken';

  constructor(private router: Router) { }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentToken(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_NAME);
  }

  login(credentials: {email: string, password: string}): Observable<any> { // Debería devolver un tipo más específico
    // Lógica de login simulada
    // En una aplicación real, aquí harías una llamada HTTP a tu backend
    console.log('AuthService login:', credentials);
    // Simular una respuesta exitosa
    return new Observable(observer => {
      setTimeout(() => {
        localStorage.setItem(this.TOKEN_NAME, 'fake-jwt-token'); // Simula guardar un token
        this.loggedIn.next(true);
        observer.next({ success: true, message: 'Login exitoso' });
        observer.complete();
        this.router.navigate(['/']); // Redirigir a la página principal o dashboard después del login
      }, 1000);
    });
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
}
