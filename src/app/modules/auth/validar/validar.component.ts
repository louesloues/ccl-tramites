import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map } from 'rxjs/operators';
import { firstValueFrom, Observable, of, Subscription } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import { AuthService } from '../../../services/auth.service';

interface ValidationResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface UserData {
  email: string;
  // otros campos que necesites
}
@Component({
  selector: 'app-validar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './validar.component.html',
  styleUrl: './validar.component.scss'
})
export class ValidarComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private _loaderService = inject(LoaderService);
  private _authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);


  isSuccess = false;
  isError = false;
  isResending = false;
  hasValidationParam = false;

  errorMessage = '';
  userEmail = '';


  private autentificarSubscription: Subscription | undefined;

  constructor() {}


  ngOnInit() {
    // Obtener email del sessionStorage o localStorage si está disponible
    this.getUserEmail();

    this.autentificarSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this._loaderService.show();
      const autentificarValue = params['autentificar'] || '';
      console.log('Valor de autentificar desde queryParams:', autentificarValue);

      if (autentificarValue) {
        this.hasValidationParam = true;
        // this.validateAccount(autentificarValue);

        this._authService.validateUser(autentificarValue).subscribe({
          next: (response) => {
            if (response['success']) {
              this.isSuccess = true;
              this.isError = false;
              // Guardar el email en sessionStorage o localStorage
              sessionStorage.setItem('registrationData', JSON.stringify({ email: this.userEmail }));
            } else {
              this.errorMessage = response['message'] || 'Error al validar la cuenta.';
              this.isError = true;
            }
          },
          error: (error) => {
            console.error('Error en la validación:', error);
            this.isError = true;
            this.errorMessage = error.error?.message || 'Error al validar la cuenta.';
          }
        });

      } else {
        console.log('No se encontró el parámetro autentificar');
        this.hasValidationParam = false;
      }

      this._loaderService.hide();
    });

  }

  private getUserEmail() {
    // Intentar obtener el email del registro previo
    const registrationData = sessionStorage.getItem('registrationData') || localStorage.getItem('registrationData');
    if (registrationData) {
      try {
        const userData = JSON.parse(registrationData);
        this.userEmail = userData.email || '';
      } catch (error) {
        console.error('Error parsing registration data:', error);
      }
    }
  }

  async resendEmail() {
    if (!this.userEmail) {
      this.errorMessage = 'No se encontró el correo electrónico. Por favor, registrate nuevamente.';
      this.isError = true;
      return;
    }

    this.isResending = true;

    try {
      const response = await this.http.post<ValidationResponse>('/api/auth/resend-validation', {
        email: this.userEmail
      }).pipe(
        catchError(error => {
          console.error('Resend error:', error);
          return of({
            success: false,
            message: 'Error al reenviar el correo. Intenta nuevamente.'
          });
        }),
        finalize(() => this.isResending = false)
      ).toPromise();

      if (response?.success) {
        // Mostrar mensaje de éxito temporal
        alert('Correo reenviado exitosamente');
      } else {
        this.errorMessage = response?.message || 'Error al reenviar el correo.';
        this.isError = true;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      this.isResending = false;
      this.errorMessage = 'Error inesperado al reenviar el correo.';
      this.isError = true;
    }
  }

  goToLogin() {
    this.router.navigate(['/tramiteonline/login']);
  }

  goToRegister() {
    this.router.navigate(['/tramiteonline/registro']);
  }
}
