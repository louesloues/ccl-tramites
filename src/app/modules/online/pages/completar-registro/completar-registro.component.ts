import { Component } from '@angular/core';
import { SolicitanteComponent } from "../../../solicitud/components/solicitante/solicitante.component";

@Component({
  selector: 'app-completar-registro',
  standalone: true,
  imports: [SolicitanteComponent],
  templateUrl: './completar-registro.component.html',
  styleUrl: './completar-registro.component.scss'
})
export class CompletarRegistroComponent {

}
