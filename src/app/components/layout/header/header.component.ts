import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'; // Importa MatIconModule si usarás iconos de Material
// import { MatButtonModule } from '@angular/material/button'; // Descomenta si usarás botones de Material

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule, // Añade MatIconModule a los imports
    // MatButtonModule, // Añade MatButtonModule si lo necesitas
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Por defecto, el usuario no está logueado
  userName: string = ''; // Nombre del usuario, vacío si no está logueado

  constructor() { }

  ngOnInit(): void {
    // Simulación de la lógica de autenticación
    // En una aplicación real, esto vendría de un servicio de autenticación
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    // Simulación: Cambia esto para probar diferentes estados
    const userIsCurrentlyLoggedIn = Math.random() > 0.5; // Simula aleatoriamente si el usuario está logueado

    if (userIsCurrentlyLoggedIn) {
      this.isLoggedIn = true;
      this.userName = 'Juan Pérez'; // Nombre de usuario mock
    } else {
      this.isLoggedIn = false;
      this.userName = '';
    }
  }

  // Métodos para simular login/logout (puedes conectarlos a botones si quieres)
  login(): void {
    this.isLoggedIn = true;
    this.userName = 'Usuario Ejemplo';
  }

  logout(): void {
    this.isLoggedIn = false;
    this.userName = '';
  }
}
