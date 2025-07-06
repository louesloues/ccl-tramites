import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Para formularios reactivos
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar para formularios reactivos
import { environment } from '../../../../environments/environment.development';
import { Auth, signInWithPopup, GoogleAuthProvider, UserCredential } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { Token } from '../../../types/token';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { Toast } from 'ngx-toastr';
import { NotificationService } from '../../../services/notification.service';
import { LoaderService } from '../../../services/loader.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { LoginResponse } from '../../../interfaces/login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
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
    private _notificationService: NotificationService,
    private _loaderService: LoaderService, // Inyectar el servicio de notificaciones
    public dialog: MatDialog, // Inyectar MatDialog
    private route: ActivatedRoute,
    private router: Router
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
      this._loaderService.show();
      if ( this.pageBreadcrumb === 'Buzón' && this.returnUrl.includes('buzon')) {
        // TODO: Implementar lógica para Buzón logueo al buzón.



      }
      else {
          console.log('Formulario de inicio de sesión válido tramite online:');
          this._authServices.login(this.loginForm.value.email, this.loginForm.value.password, false)
          .subscribe({
            next: (response:ApiResponse<LoginResponse>) => {
              console.log('Respuesta del servidor:', response);
              if (response.success) {
                this._authServices.setSessionInfo({ id: response.data.token, usuarioID: response.data.usuarioID , PrecapturaPersonaID: response.data.PrecapturaPersonaID,correo: response.data.usr });
                //localStorage.setItem('token', response['token']);
                this._notificationService.showSuccess(response.message,'CCL Tramites');
                // Navigate to a different route or show success message
                this._loaderService.hide();
                if (!response.data.PrecapturaPersonaID) {
                  this._notificationService.showInfo('Debe completar registro para su carpeta ciudadana.','Carpeta de Ciudadano');
                  this.router.navigate(['/tramiteonline/completar-registro']);
                  this._loaderService.hide();
                }
                else if (response.data.PrecapturaPersonaID) {
                  this.router.navigate(['/tramiteonline/mistramites']);
                }

              } else {
                 this._notificationService.showError('Login failed:', response.message);
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

  loginWithGoogle() {
   const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result:UserCredential) => {
         this._authServices.login(result.user.email, "firebase", true)
          .subscribe({
            next: (response) => {
              if (response.success) {
                const token: Token = { id: response.data.token, usuarioID: response.data.userId , correo: response.data.usr, PrecapturaPersonaID: response.data.PrecapturaPersonaID };
                this._authServices.setSessionInfo(token);
                localStorage.setItem('token', response.token);
                this._notificationService.showSuccess('Bienvenido.','CCL Tramites');
              } else {
                this._notificationService.showError('Login failed:', response.message);
              }
            },
            error: (error) => {
              console.error('Error de autenticación:', error);
              this._notificationService.showError('Error de autenticación:', error.message || 'Ocurrió un error al iniciar sesión.');
            }
          });
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
