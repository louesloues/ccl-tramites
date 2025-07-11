export interface Entidad {
  entidadID: string;
  nombre: string;
  abreviatura: string;
  capID: string;
  capital: string;
  cveCURP: string;
  pobTot: number;
  pobMas: number;
  pobFem: number;
  activo: number;
  usuarioCaptura: string;
  fechaCaptura: string | Date;
  usuarioModifico?: string; // Opcional, puede no existir en un nuevo registro
  fechaModifico?: string | Date;  // Opcional, puede no existir en un nuevo registro
  versionRegistro: number;
  estatusRegistro: boolean;
}
