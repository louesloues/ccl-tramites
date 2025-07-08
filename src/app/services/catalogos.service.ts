import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { Escolaridad } from '../models/escolaridad.model';
import { Nacionalidad } from '../models/nacionalidad.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Sexo } from '../models/genero.model';
import { EstadoCivil } from '../models/estadocivil.model';
import { GrupoVulnerable } from '../models/grupo.model';

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

  public getEscolaridades(): Observable<ApiResponse<Escolaridad[]>> {
    return this.http.get<ApiResponse<Escolaridad[]>>(`${this.baseUrl}Escolaridad`, { headers: this.headers });
  }

  public getNacionalidades(): Observable<ApiResponse<Nacionalidad[]>> {
    return this.http.get<ApiResponse<Nacionalidad[]>>(`${this.baseUrl}Nacionalidad`, { headers: this.headers });
  }

  getGeneros(): Observable<ApiResponse<Sexo[]>> {
    return this.http.get<ApiResponse<Sexo[]>>(`${this.baseUrl}Sexo`, { headers: this.headers });
  }

  getEstadoCivil(): Observable<ApiResponse<EstadoCivil[]>> {
    return this.http.get<ApiResponse<EstadoCivil[]>>(`${this.baseUrl}EstadoCivil`, { headers: this.headers });
  }

  getGrupoVulnerable(): Observable<ApiResponse<GrupoVulnerable[]>> {
    return this.http.get<ApiResponse<GrupoVulnerable[]>>(`${this.baseUrl}GrupoVulnerable`, { headers: this.headers });
  }

}
