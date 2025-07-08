import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { Escolaridad } from '../models/escolaridad.model';
import { Nacionalidad } from '../models/nacionalidad.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Sexo } from '../models/genero.model';

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
    return this.http.get<ApiResponse<Escolaridad[]>>(`${this.baseUrl}escolaridad`, { headers: this.headers });
  }

  public getNacionalidades(): Observable<ApiResponse<Nacionalidad[]>> {
    return this.http.get<ApiResponse<Nacionalidad[]>>(`${this.baseUrl}nacionalidad`, { headers: this.headers });
  }

  getGeneros(): Observable<ApiResponse<Sexo[]>> {
    return this.http.get<ApiResponse<Sexo[]>>(`${this.baseUrl}genero`, { headers: this.headers });
  }


}
