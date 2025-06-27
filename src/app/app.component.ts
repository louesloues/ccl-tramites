import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent // <-- Añadir HeaderComponent aquí
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // o .css si no usaste --style=scss
})
export class AppComponent {
  title = 'ccl-tramites'; // O el nombre que tenga tu proyecto
}
