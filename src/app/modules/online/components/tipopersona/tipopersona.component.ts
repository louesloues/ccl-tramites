import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-tipopersona',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    ],
  templateUrl: './tipopersona.component.html',
  styleUrl: './tipopersona.component.scss'
})
export class TipopersonaComponent {
  selectedTipo: string = '';
  


  selectTipoPersona(tipo: string) {
    this.selectedTipo = tipo;
  }

  continueToNext() {
    if (this.selectedTipo) {
      // Aquí puedes implementar la lógica para continuar al siguiente paso
      console.log(`Continuando con tipo: ${this.selectedTipo}`);
    } else {
      console.warn('Por favor, selecciona un tipo de persona antes de continuar.');
    }
  }
}
