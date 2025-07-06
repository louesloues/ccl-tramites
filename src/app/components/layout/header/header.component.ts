import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; // <-- IMPORTANTE: Añadir MatMenuModule
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

// Importamos nuestro servicio de autenticación

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule, // Necesario para mat-button
    MatMenuModule    // Necesario para mat-menu
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Inyectamos el servicio de autenticación para poder usarlo.
  // 'inject()' es la forma moderna de inyección de dependencias en Angular.
  // Lo hacemos público para poder acceder a él desde la plantilla HTML.
  public _authServices: AuthService = inject(AuthService);

  /**
   * Llama al método logout de nuestro servicio de autenticación.
   * La UI se actualizará automáticamente gracias a la reactividad de los signals.
   */
  logout(): void {
    this._authServices.logout();
    // Aquí podrías redirigir al usuario si es necesario.
    // Por ejemplo: inject(Router).navigate(['/login']);
  }
}
