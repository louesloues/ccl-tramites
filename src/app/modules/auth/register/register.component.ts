import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { LoaderService } from '../../../services/loader.service';

// Custom validator for password matching
export function passwordMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _authServices: AuthService,
    private _notificationService: NotificationService,
    private _loaderService: LoaderService,
    private router: Router
    ) {
    this.ngOnInit();
  }


  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });  // Aquí podrías inicializar algo si es necesario
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Register Form Data:', this.registerForm.value);
      this._authServices.addUser(this.registerForm.value.email, this.registerForm.value.password).subscribe({
            next: (response) => {
              if (response['success']) {
                this.router.navigate(['/tramiteonline/validar']);
                // this._authServices.setSessionInfo({ id: response.data.token, userId: response.data.userId });
                // localStorage.setItem('token', response.token);
                this._notificationService.showSuccess('Bienvenido.','CCL Tramites');
                // Navigate to a different route or show success message
                this._loaderService.hide();
              } else {
                 this._notificationService.showError('Login failed:', response['message']);
                this._loaderService.hide();
              }
            },
            error: (error) => {
             if (error.status === 401) {
                // Manejar error 401 (Unauthorized)
                if (error.error && error.error.message) {
                  // Si el servidor proporciona un mensaje de error específico
                  this._notificationService.showError('Unauthorized:', error.error.message);
                  // Aquí puedes mostrar el mensaje al usuario o manejarlo de otra manera
                } else {
                  this._notificationService.showError('Unauthorized: Access denied');
                  // Mensaje genérico si no hay un mensaje específico del servidor
                }
              } else if (error.status === 400) {
                // Manejar error 400 (Bad Request)
                this._notificationService.showError('Bad Request:', error.error.message || 'Invalid request');
              } else if (error.status === 404) {
                // Manejar error 404 (Not Found)
                this._notificationService.showError('Not Found: The requested resource does not exist');
              } else if (error.status === 500) {
                // Manejar error 500 (Internal Server Error)
                this._notificationService.showError('Server Error: Please try again later');
              } else if (error.status === 0) {
                // Error de red o servidor no alcanzable
                this._notificationService.showError('Network Error: Unable to connect to the server');
              } else {
                // Otros errores
                this._notificationService.showError('An unexpected error occurred:', error.message);
              }
              this._loaderService.hide();
                      }
      });

      }
  }

}
