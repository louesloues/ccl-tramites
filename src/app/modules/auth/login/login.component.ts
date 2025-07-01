import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Para formularios reactivos
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar para formularios reactivos
import { environment } from '../../../../environments/environment.development';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { Token } from '../../../types/token';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { Toast } from 'ngx-toastr';
import { NotificationService } from '../../../services/notification.service';

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
    RouterModule,
     MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private returnUrl: string = '';
  private pageBreadcrumb: string = '';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private _authServices:AuthService,
    public dialog: MatDialog, // Inyectar MatDialog
    private route: ActivatedRoute,
    private _notificationService: NotificationService
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
     // Leer la URL de retorno para determinar el tipo de input para el diálogo
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '';
    });

    this.pageBreadcrumb = this.route.snapshot.data['breadcrumb'];

  }

  onSubmit(): void {
    if (this.loginForm.valid) {

      if ( this.pageBreadcrumb === 'Buzón' && this.returnUrl.includes('buzon')) {
        // TODO: Implementar lógica para Buzón logueo al buzón.



      }
      else {
        this._authServices.login(this.loginForm.value.email, this.loginForm.value.password, false)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this._authServices.setSessionInfo({ id: response.data.token, userId: response.data.userId });
                localStorage.setItem('token', response.token);
                this._notificationService.showSuccess('Bienvenido.','CCL Tramites');
                // Navigate to a different route or show success message
              } else {
                 this._notificationService.showError('Login failed:', response.message);
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
                      }
                    });
            }
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


    openForgotPasswordDialog(): void {
      let inputType: 'CURP' | 'RFC' = 'CURP'; // Por defecto CURP
      if (this.returnUrl.includes('buzon')) {
        inputType = 'RFC'; // Si viene de buzón, solicitar RFC (o CURP según se decida)
      }

      const dialogRef = this.dialog.open(ForgotPasswordComponent, {
        width: '400px',
        data: { inputType: inputType }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._authServices.forgotPassApi(result).subscribe({
            next: (response) => {
              if (!response['ActivoBool']){
                this._notificationService.showError('El usuario no existe o no está activo', 'Error de autenticación');
              }


            }

          });
      }});
    }

}
