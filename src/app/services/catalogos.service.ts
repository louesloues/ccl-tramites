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
import { CatalogoItem, CatalogoItemCP } from '../interfaces/interface.catalogoitem';
import { Entidad } from '../models/entidad';
import { Cp, Municipio } from '../interfaces/interface.cp';
import { TipoVialidad } from '../models/tipovialiadad';

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

  getEstados(): Observable<CatalogoItem[]> {
    return this.http.get<Entidad[]>(`${this.baseUrl}Entidad`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.entidadID, nombre: item.nombre } as CatalogoItem)) || [];
      })
    );
  }

  // getMunicipios(estadoId: number): Observable<CatalogoItem[]> {
  //   return this.http.get<CatalogoItem[]>(`${this.baseUrl}Municipio/${estadoId}`, { headers: this.headers }).pipe(
  //     map(response => {
  //       return response?.map(item => ({ id: item.id, nombre: item.nombre } as CatalogoItem)) || [];
  //     })
  //   );
  // }

  getColonias(municipioId: number): Observable<CatalogoItem[]> {
    return this.http.get<Municipio[]>(`${this.baseUrl}Colonia/${municipioId}`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.municipioID, nombre: item.nombre } as CatalogoItem)) || [];
      })
    );
  }

  getCodigosPostales(cp: string): Observable<CatalogoItemCP[]> {
    return this.http.get<Cp[]>(`${this.baseUrl}CP/ByCP/${cp}`, { headers: this.headers }).pipe(
      map(response => {
        if (!response || response.length === 0) {
          return [];
        }

        const primerElemento = response[0];
        const listaColonias = response.map(item => item.asenta);

        const resultado: CatalogoItemCP = {
          codPos: primerElemento.codPos,
          municipio: primerElemento.descMnpio,
          municipioID: primerElemento.cveMnpio,
          estado: primerElemento.descEstado,
          cveEstado: primerElemento.cveEstado,
          colonias: listaColonias
        };

        return [resultado];
      })
    );
  }

  getTiposVialidad(): Observable<CatalogoItem[]> {
    return this.http.get<TipoVialidad[]>(`${this.baseUrl}TipoVialidad`, { headers: this.headers }).pipe(
      map(response => {
        return response?.map(item => ({ id: item.tipoVialidadID, nombre: item.nombre } as CatalogoItem)) || [];
      })
    );
  }


}
