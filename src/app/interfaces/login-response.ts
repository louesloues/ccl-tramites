export interface LoginResponse {
  usuarioID:     number;
  usr:           string;
  token?:         string;
  tipoPersonaID?: number;
  urlOrigin?:     string;
  precapturaPersonaID?: string;
}
