import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Para formularios reactivos
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar para formularios reactivos
import { environment } from '../../../../environments/environment.development';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { Token } from '../../../types/token';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private _authServices:AuthService
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this._authServices.login(this.loginForm.value.email, this.loginForm.value.password, false)
        .subscribe({
          next: (response) => {
            if (response.success) {
              console.log('Login successful:', response.data);
              this._authServices.setSessionInfo({ id: response.data.token, userId: response.data.userId });
              localStorage.setItem('token', response.token);
              console.log('Login successful, token stored.');
              // Navigate to a different route or show success message
            } else {
              console.log('Login failed:', response.message);
            }
          },
          error: (error) => {
           if (error.status === 401) {
              // Manejar error 401 (Unauthorized)
              if (error.error && error.error.message) {
                // Si el servidor proporciona un mensaje de error específico
                console.log('Unauthorized:', error.error.message);
                // Aquí puedes mostrar el mensaje al usuario o manejarlo de otra manera
              } else {
                console.log('Unauthorized: Access denied');
                // Mensaje genérico si no hay un mensaje específico del servidor
              }
            } else if (error.status === 400) {
              // Manejar error 400 (Bad Request)
              console.log('Bad Request:', error.error.message || 'Invalid request');
            } else if (error.status === 404) {
              // Manejar error 404 (Not Found)
              console.log('Not Found: The requested resource does not exist');
            } else if (error.status === 500) {
              // Manejar error 500 (Internal Server Error)
              console.log('Server Error: Please try again later');
            } else if (error.status === 0) {
              // Error de red o servidor no alcanzable
              console.log('Network Error: Unable to connect to the server');
            } else {
              // Otros errores
              console.log('An unexpected error occurred:', error.message);
            }
                    }
                  });
          }
  }

  loginWithGoogle() {
   const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        console.log('Usuario autenticado:', result.user);
        // Aquí puedes redirigir al usuario o realizar otras acciones después del login
      })
      .catch((error) => {
        console.error('Error de autenticación:', error);
        // Manejo de errores
      });
  }
}
