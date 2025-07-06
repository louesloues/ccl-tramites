import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // La lógica es la misma, pero usando 'inject' para obtener los servicios
  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirigir a la página de login
  console.log('AuthGuard: Usuario no autenticado, redirigiendo a /login');
  return router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
};