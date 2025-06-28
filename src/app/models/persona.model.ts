export interface PrecapturaPersona {
  PrecapturaPersonaID: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  curp?: string;
  fechaNacimiento: string;
  correo?: string;
  telefonoCel?: string;
  usuarioID?: number;
  numeroIdentificacion?: string;
  generoID?: number;
  nombreOcupacion?: string;
  esRepProcurador?: boolean;
  usuarioCaptura?: string;
  fechaCaptura: string;
  usuarioModifico?: string;
  fechaModifico?: string;
  activo: boolean; //
  tipoIdentificacionID?: number;
  nacionalidadID?: number;
  escolaridadID?: number;
  estadoCivilID?: number;
  ocupacionID?: number;
  grupoVulnerableID?: number;
}
