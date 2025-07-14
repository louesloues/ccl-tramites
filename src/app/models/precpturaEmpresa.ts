export interface PrecapturaEmpresa {
  precapturaEmpresaID: string;
  rfc:                 string;
  razonSocial:         string;
  nombreComercial:     string;
  regimenJuridicoID:   number;
  usuarioID:           number;
  ramaID:              number;
  giroID:              number;
  correo:              string;
  telefono:            string;
  usuarioCaptura:      string;
  fechaCaptura:        Date;
  usuarioModifico:     string;
  fechaModifico:       Date;
  activo:              number;
}
