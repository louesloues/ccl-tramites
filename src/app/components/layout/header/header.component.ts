import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
// Descomentar si se usan botones o iconos en el futuro:
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header', // El selector por defecto es app-header, lo mantendremos así.
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    // MatButtonModule,
    // MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor() { }
}
