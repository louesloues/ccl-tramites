export interface Cp {
  codigo:          string;
  asenta:          string;
  descTipoAsenta:  string;
  tipoAs:          number;
  descMnpio:       string;
  descEstado:      string;
  ciudad:          string;
  codPos:          string;
  cveEstado:       string;
  oficina:         string;
  cveTipoAsenta:   string;
  cveMnpio:        string;
  cveCiudad:       string;
  idAsentaCPcons:  string;
  municipioID:     string;
  municipio:       Municipio;
  zona:            string;
  usuarioCaptura:  string;
  usuarioModifico: string;
  fechaCaptura:    Date;
  fechaModifico:   Date;
}

export interface Municipio {
  municipioID:     string;
  entidadID:       string;
  nombre:          string;
  cabID:           string;
  cabecera:        string;
  pTot:            number;
  pMas:            number;
  pFem:            number;
  vTot:            number;
  activo:          number;
  usuarioCaptura:  string;
  fechaCaptura:    Date;
  usuarioModifico: string;
  fechaModifico:   Date;
  versionRegistro: number;
  estatusRegistro: boolean;
  sedeMunicipio:   SedeMunicipio;
}

export interface SedeMunicipio {
  sedeID:      number;
  municipioID: string;
}
