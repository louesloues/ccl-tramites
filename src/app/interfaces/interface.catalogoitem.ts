import { Entidad } from '../models/entidad';
import { Municipio } from './interface.cp';
export interface CatalogoItem {
  id: number|string;
  nombre: string;
}


export interface CatalogoItemCP {
  codPos: number|string;
  municipioID: string;
  municipio: string;
  cveEstado: string;
  estado: string;
  colonias: string[];
}


