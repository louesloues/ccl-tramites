import { Entidad } from '../models/entidad';
import { Municipio } from './interface.cp';
export interface CatalogoItem {
  id: number|string;
  nombre: string;
}


export interface CatalogoItemCP {
  codPost: number|string;
  municipioID: string;
  Municipio: string;
  cveEstado: string;
}


