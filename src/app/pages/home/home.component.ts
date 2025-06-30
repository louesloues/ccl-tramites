// home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  menuOptions = [
    {
      title: 'Solicitud',
      description: '',
      route: '/solicitud',
      icon:'../../assets/images/descarga.png' // Añadir imagen para la opción
    },
    {
      title: 'Ratificación',
      //icon: '✅',
      description: '',
      route: '/ratificacion',
      icon: '../../assets/images/ratificacion.png'
    },
    {
      title: 'Trámite Online',
      //icon: '💻',
      description: '',
      route: '/tramiteonline',
      icon: '../../assets/images/tramite-online.png' // Añadir imagen para la opción
    },
    {
      title: 'Buzón Electrónico',
      //icon: '📧',
      description: '',
      route: '/buzon',
      icon: '../../assets/images/buzon-electronico.png' // Añadir imagen para la opción
    }
  ];

  constructor(private router: Router) {} // Inyectar Router

  onOptionClick(option: any) {
    console.log('Navegando a:', option.route);
    this.router.navigate([option.route]); // Usar Router para navegar
  }
}
