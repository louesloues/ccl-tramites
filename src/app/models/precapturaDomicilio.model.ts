export interface PrecapturaDomicilio {
    precapturaDomicilioID: number;
    entidadID:             string;
    municipioID:           string;
    localidadID:           number;
    cp:                    string;
    colonia:               string;
    calle:                 string;
    tipoVialidadID:        number;
    referenciaCalles:      string;
    esNuevaColonia:        boolean;
    numeroExterior:        string;
    numeroInterior:        string;
    observaciones:         string;
    latitud:               string;
    longitud:              string;
    usuarioCaptura:        string;
    fechaCaptura:          string | Date;
    usuarioModifico:       string;
    fechaModifico:         string | Date;
    activo:                number;
  }
