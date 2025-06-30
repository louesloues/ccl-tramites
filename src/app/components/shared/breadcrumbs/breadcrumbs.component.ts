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
  ver_breadcrumb: boolean = true; // Controla la visibilidad del breadcrumb

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
      switchMap(route => route.data),
      map(data => data['breadcrumb'])
    ).subscribe(breadcrumb => {
      this.breadcrumb = breadcrumb;
      if (!breadcrumb) {
        this.ver_breadcrumb = false; // Si no hay breadcrumb, ocultarlo
        this.breadcrumb = 'Inicio'; // Valor por defecto
      }
      else this.ver_breadcrumb = true; // Si hay breadcrumb, mostrarlo
    });
  }

  goBack(): void {
    this.location.back();
  }
}
