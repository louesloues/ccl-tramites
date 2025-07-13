import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumb: string = '';
  icon_bread: string = '';
  ver_breadcrumb: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.activatedRoute),
    map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    switchMap(route => route.data)
    // ELIMINA la siguiente línea para que el objeto 'data' completo llegue al subscribe
    // map(data => data['breadcrumb'])
  ).subscribe(data => { // <-- Ahora recibes el objeto 'data' completo

    if (data && data.breadcrumb) {
        // Si hay data y un breadcrumb definido en la ruta
        this.breadcrumb = data.breadcrumb;
        this.icon_bread = data.icon || ''; // Obtiene el ícono, si no existe, lo deja vacío
        this.ver_breadcrumb = true;
      } else {
        // Si la ruta no tiene data.breadcrumb, usa valores por defecto
        this.breadcrumb = 'Inicio';
        this.icon_bread = 'home'; // Un ícono por defecto para 'Inicio'
        this.ver_breadcrumb = true; // Opcional: decide si quieres mostrar 'Inicio' siempre
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
