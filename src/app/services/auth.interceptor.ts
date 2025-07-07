// Archivo: src/app/core/interceptors/auth.interceptor.ts

import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  // Lista de rutas que NO deben llevar el token.
  // Añade aquí cualquier fragmento de URL que quieras excluir.
  private exclusionList: string[] = ['/LoginWebCCL'];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 1. Verificar si la URL de la petición está en la lista de exclusión.
    const isExcluded = this.exclusionList.some(url => req.url.includes(url));

    if (isExcluded) {
      // Si la ruta está excluida, dejamos pasar la petición sin modificarla.
      return next.handle(req);
    }

    // 2. Obtener el token del AuthService.
    const authToken = this.authService.authToken(); // Obtenemos el valor del signal

    // 3. Si hay token, clonamos la petición y añadimos la cabecera.
    console.log(`Añadiendo token de autenticación: ${authToken}`);
    if (authToken) {
      console.log(`Añadiendo token de autenticación: ${authToken}`);
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // Enviamos la petición clonada con la cabecera.
      return next.handle(authReq);
    }

    // 4. Si no hay token (y no es una ruta excluida), dejamos pasar la petición original.
    return next.handle(req);
  }
}
