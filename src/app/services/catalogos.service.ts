import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { Escolaridad } from '../models/escolaridad.model';
import { Nacionalidad } from '../models/nacionalidad.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Sexo } from '../models/genero.model';
import { EstadoCivil } from '../models/estadocivil.model';
import { GrupoVulnerable } from '../models/grupo.model';
import { TipoIdentificacion} from '../models/tipoidentificacion.model';
import { CatalogoItem } from '../interfaces/interface.catalogoitem';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
    private http = inject(HttpClient);

    // APIs
    private baseUrl = environment.apiUrl;
    private baseUrlOld = environment.apiUrlOld;
    private headers = new HttpHeaders();


  constructor() { }

  public getEscolaridades(): Observable<CatalogoItem[]> {
    return this.http.get<Escolaridad[]>(`${this.baseUrl}Escolaridad`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.escolaridadID, nombre: item.nombre } as CatalogoItem)) || [];
      })
    );
  }

  getGeneros(): Observable<CatalogoItem[]> {
    return this.http.get<Sexo[]>(`${this.baseUrl}Sexo`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.sexoID, nombre: item.nombre } as CatalogoItem)) || [];
      })
    );
  }


  public getNacionalidades(): Observable<CatalogoItem[]> {
    return this.http.get<Nacionalidad[]>(`${this.baseUrl}Nacionalidad`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.nacionalidadID, nombre: item.nombre } as CatalogoItem)) || []
      })
    );
  }

  getEstadoCivil(): Observable<CatalogoItem[]> {
    return this.http.get<EstadoCivil[]>(`${this.baseUrl}EstadoCivil`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.estadoCivilID, nombre: item.nombre } as CatalogoItem)) || []
      })
    );
  }

  getGrupoVulnerable(): Observable<CatalogoItem[]> {
    return this.http.get<GrupoVulnerable[]>(`${this.baseUrl}GrupoVulnerable`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.grupoVulnerableID, nombre: item.nombre } as CatalogoItem)) || []
      })
    );
  }

  getTipoIdentificacion(): Observable<CatalogoItem[]>{
    return this.http.get<TipoIdentificacion[]>(`${this.baseUrl}TipoIdentificacion`,{headers:this.headers}).pipe(
      map(response => {
        return response?.map(item => ( {id: item.tipoIdentificacionID, nombre: item.nombre} as CatalogoItem )) || []
      })
    );
  }
}
