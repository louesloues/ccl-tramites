import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component'; // Ajusta la ruta si es necesario
import { HomeComponent } from './pages/home/home.component';
import { BreadcrumbsComponent } from './components/shared/breadcrumbs/breadcrumbs.component';
import { NotificationService } from './services/notification.service';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeComponent,
    HeaderComponent, // <-- Añadir HeaderComponent aquí
    BreadcrumbsComponent,
    LoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // o .css si no usaste --style=scss
})
export class AppComponent {
  title = 'ccl-tramites'; // O el nombre que tenga tu proyecto
  isLoading: boolean = false;
  private loaderSubscription!: Subscription; // Define la propiedad para la suscripción

  constructor(
    private notificationService: NotificationService,
    private _loaderService: LoaderService // Inyecta LoaderService si lo necesitas
    ) {} // Inyecta NotificationService



  ngOnInit(): void {
    this.notificationService.showSuccess('¡Bienvenido!', 'Centro de conciliación laboral del estado de guanajuato');
     this.loaderSubscription = this._loaderService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
}
