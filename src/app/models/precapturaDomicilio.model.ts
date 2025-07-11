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
    fechaCaptura:          string | Date; // Usar string es más seguro para la deserialización inicial
    usuarioModifico:       string;
    fechaModifico:         string | Date;
    activo:                number; // Podría ser un booleano (0 o 1), pero 'number' es más seguro
  }
