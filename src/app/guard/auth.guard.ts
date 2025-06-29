import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.authService.isLoggedIn.pipe(
      take(1), // Tomar el primer valor emitido y completar
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true; // Usuario autenticado, permitir acceso
        } else {
          // Usuario no autenticado, redirigir a la página de login
          console.log('AuthGuard: Usuario no autenticado, redirigiendo a /login');
          return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url }});
        }
      })
    );
  }
}
