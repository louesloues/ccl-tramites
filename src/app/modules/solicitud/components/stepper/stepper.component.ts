import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var $: any; // Declaración para jQuery si se usa directamente para los modales bootstrap

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  encapsulation: ViewEncapsulation.None // Para que los estilos globales de Bootstrap apliquen correctamente
})
export class StepperComponent implements OnInit {
  currentStep: string = 'stepIndustria';

  // Modelo para los datos del formulario (simplificado)
  formData: any = {
    industria: null,
    solicitud: {
      fecha_conflicto: '',
      objeto_solicitud_id: null,
    },
    solicitantes: [],
    citados: [],
    descripcion_hechos: ''
  };


  constructor() { }

  ngOnInit(): void {
    // Inicializar Popovers de Bootstrap (si se usan directamente)
    // $('[data-toggle="popover"]').popover();

    // Manejar clicks en los tabs del stepper
    $('#tabSolicitudes a').on('click', (e: any) => {
      e.preventDefault();
      // Solo permitir navegación si el tab no está deshabilitado
      if (!$(e.target).closest('li.nav-item').attr('style')?.includes('pointer-events: none')) {
        $(e.target).tab('show');
        this.currentStep = $(e.target).attr('href').substring(1);
      }
    });
  }

  // --- Lógica de navegación y validación (simplificada) ---
  validarIndustria(): void {
    // Aquí iría la lógica de validación del paso de Industria
    console.log('Validando Industria...');
    // Simulación: si es válido, avanza al siguiente paso
    this.enableStep('step-solicitud');
    this.gotoStep('stepSolicitud');
    // Aquí se mostrarían los modales de competencia si fuera necesario
    // Por ejemplo: $('#modal-competencia-local').modal('show');
  }

  sendIndustria(): void {
    // Lógica después de confirmar el modal de competencia
    console.log('Industria confirmada tras modal.');
    this.enableStep('step-solicitud');
    this.gotoStep('stepSolicitud');
  }


  validarSolicitud(): boolean {
    // Aquí iría la lógica de validación del paso de Datos de la Solicitud
    console.log('Validando Solicitud...');
    // Simulación: si es válido, avanza
    this.enableStep('step-solicitante');
    this.gotoStep('stepSolicitante');
    return false; // Prevenir submit de formulario real por ahora
  }

  validarExisteSolicitante(): void {
    // Aquí iría la lógica de validación del paso de Datos del Solicitante
    console.log('Validando Solicitante...');
    // Simulación: si es válido, avanza
    this.enableStep('step-citado');
    this.gotoStep('stepCitado');
  }

  validarExisteCitado(): void {
    // Aquí iría la lógica de validación del paso de Datos del Citado
    console.log('Validando Citado...');
    // Simulación: si es válido, avanza
    this.enableStep('step-descripcion');
    this.gotoStep('stepDescripcion');
  }

  submitDescripcion(): boolean {
    // Aquí iría la lógica de validación del paso de Descripción
    console.log('Validando Descripción...');
    // Simulación: si es válido, avanza
    this.enableStep('step-resumen');
    this.gotoStep('stepResumen');
    return false; // Prevenir submit de formulario real por ahora
  }


  // --- Funciones auxiliares para el stepper ---
  gotoStep(stepId: string): void {
    $('#' + stepId.replace('#', '')).tab('show');
    this.currentStep = stepId.replace('#', '');
  }

  enableStep(stepLinkId: string): void {
    // Habilita el paso y los anteriores si es necesario
    const stepElement = $('#' + stepLinkId).closest('li.nav-item');
    stepElement.css('pointer-events', 'auto');
    stepElement.find('.nav-link').removeClass('disabled'); // Asumiendo una clase 'disabled'

    // Marcar como completado el paso actual antes de avanzar (opcional)
    const currentTabLink = $('#tabSolicitudes .nav-link.active');
    if (currentTabLink.length) {
      // currentTabLink.addClass('completed'); // O alguna otra clase visual
    }
  }

  // --- Funciones de los modales (simuladas) ---
  mostrarDetalleIndustria(element: any): void {
    const nombre = $(element).data('nombre');
    const descripcion = $(element).data('descripcion');
    $('#nombre_industria').text(nombre);
    $('#detalle_industria').html(descripcion);
    $('#modal-industria-detalle').modal('show');
  }

  pasoCompetencia(direccion: string): void {
    let pasoActual = parseInt($('#info_competencia_paso_actual').val(), 10);
    const totalPasos = parseInt($('#count_info_competencia').val(), 10);

    $('.informacion_competencia_texto').hide();

    if (direccion === 'siguiente') {
      pasoActual++;
    } else if (direccion === 'anterior') {
      pasoActual--;
    } else if (direccion === 'inicial') {
      pasoActual = 1;
      $('#modal-informativo').modal('hide'); // Cierra el modal si es 'inicial' y se presiona el botón "Ir a cuestionarios"
      return; // No seguir con la lógica de mostrar/ocultar botones si se cierra
    }

    pasoActual = Math.max(1, Math.min(pasoActual, totalPasos)); // Asegurar que esté en rango
    $('#info_competencia_paso_actual').val(pasoActual);
    $('#informacion_competencia' + pasoActual).show();

    // Lógica de botones
    if (pasoActual === 1) {
      $('#regresar_texto_competencia').hide();
      $('#continuar_leyendo').show();
      $('#cerrar_leyendo').hide();
    } else if (pasoActual === totalPasos) {
      $('#regresar_texto_competencia').show();
      $('#continuar_leyendo').hide();
      $('#cerrar_leyendo').show();
    } else {
      $('#regresar_texto_competencia').show();
      $('#continuar_leyendo').show();
      $('#cerrar_leyendo').hide();
    }
  }

  // --- Lógica para agregar/editar solicitantes/citados (muy simplificada) ---
  // Esta parte sería mucho más compleja en una aplicación real y probablemente
  // involucraría servicios y manejo de arrays de objetos.

  showForm(type: 'solicitante' | 'citado'): void {
    if (type === 'solicitante') {
      $('#divCapturaSolicitante').show();
      $('#divTablaSolicitantes').hide(); // Ocultar tabla mientras se edita/agrega
    } else {
      $('#divCapturaCitado').show();
      $('#divTablaCitados').hide();
    }
  }

  cancelarEdicion(type: 'solicitante' | 'citado'): void {
     if (type === 'solicitante') {
      $('#divCapturaSolicitante').hide();
      $('#divTablaSolicitantes').show();
      // Limpiar formulario solicitante
    } else {
      $('#divCapturaCitado').hide();
      $('#divTablaCitados').show();
      // Limpiar formulario citado
    }
  }

  limpiarSolicitante(): void {
    // Lógica para limpiar el formulario de solicitante
    $('#frmSolicitante').trigger('reset'); // Ejemplo básico
  }

  limpiarCitado(): void {
    // Lógica para limpiar el formulario de citado
    $('#frmCitado').trigger('reset'); // Ejemplo básico
  }


  // Simulación de funciones JS globales que estarían en los scripts del HTML original
  // Deberían ser reemplazadas por lógica Angular si es posible.
  getDataCURP(curp: string, tipo: string): void {
    console.log(`Buscando datos para CURP: ${curp} (Tipo: ${tipo})`);
    // Aquí iría la lógica de consulta a servicios externos si es necesario
  }

  validarRFCSolicitante(rfc: string): void {
    console.log(`Validando RFC Solicitante: ${rfc}`);
  }
   validarRFCCitado(rfc: string): void {
    console.log(`Validando RFC Citado: ${rfc}`);
  }

  editForm(stepName: string): void {
    this.gotoStep(stepName);
    // Lógica adicional para cargar datos si es necesario
  }

  regresarSolicitud(): void {
    this.gotoStep('stepSolicitud');
  }

}
