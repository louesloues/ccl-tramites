export interface Escolaridad {
  escolaridadID: number;
  nombre: string;
  activo: number; // Considera boolean (true/false)
  usuarioCaptura?: string;
  fechaCaptura: string; // Formato ISO
  usuarioModifico?: string;
  fechaModifico?: string; // Formato ISO
}
