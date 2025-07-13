export interface TipoVialidad {
  tipoVialidadID: number;
  nombre: string;
  usuarioCaptura: string;
  fechaCaptura: string | Date;
  usuarioModifico?: string;
  fechaModifico?: string | Date;
  activo: number;
}
