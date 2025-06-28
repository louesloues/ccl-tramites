// home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
      icon: '📄',
      description: 'Crear nueva solicitud',
      route: '/solicitud'
    },
    {
      title: 'Ratificación',
      icon: '✅',
      description: 'Ratificar documentos',
      route: '/ratificacion'
    },
    {
      title: 'Trámite Online',
      icon: '💻',
      description: 'Gestión en línea',
      route: '/tramite-online'
    },
    {
      title: 'Buzón Electrónico',
      icon: '📧',
      description: 'Mensajes y notificaciones',
      route: '/buzon'
    }
  ];

  onOptionClick(option: any) {
    console.log('Navegando a:', option.route);
    // Aquí puedes agregar la navegación con Router
    // this.router.navigate([option.route]);
  }
}