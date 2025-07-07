import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preguntas-frecuentes',
  imports: [CommonModule],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrl: './preguntas-frecuentes.component.css'
})
export class PreguntasFrecuentesComponent implements OnInit { 
  preguntas = [
    {
      pregunta: '¿Cómo puedo comprar entradas?',
      respuesta: 'Puedes comprar entradas de forma online a través de nuestra plataforma web, o en nuestros puntos de venta físicos. El proceso es simple: selecciona el evento, elige tus asientos y completa el pago.'
    },
    {
      pregunta: '¿Qué métodos de pago aceptan?',
      respuesta: 'Aceptamos tarjetas de crédito y débito, transferencias bancarias, y pagos en efectivo en nuestros puntos de venta. También ofrecemos la opción de pago en cuotas sin interés con tarjetas seleccionadas.'
    },
    {
      pregunta: '¿Puedo cancelar o cambiar mi entrada?',
      respuesta: 'Las políticas de cancelación y cambio varían según el evento. En general, las entradas no son reembolsables, pero puedes contactarnos para consultar opciones específicas según el caso.'
    },
    {
      pregunta: '¿Cómo recibo mi entrada digital?',
      respuesta: 'Una vez completada la compra, recibirás un email con tu entrada digital. También puedes acceder a ella desde tu cuenta en nuestra plataforma. Llega al evento con tu entrada en el celular o impresa.'
    },
    {
      pregunta: '¿Qué hago si perdí mi entrada?',
      respuesta: 'No te preocupes, puedes acceder a tu entrada desde tu cuenta en nuestra plataforma web. Si tienes problemas, contacta nuestro servicio al cliente y te ayudaremos a recuperarla.'
    },
    {
      pregunta: '¿Los eventos tienen restricciones de edad?',
      respuesta: 'Cada evento puede tener diferentes restricciones de edad. Esta información se muestra claramente en la página del evento. Te recomendamos revisar antes de comprar.'
    },
    {
      pregunta: '¿Puedo transferir mi entrada a otra persona?',
      respuesta: 'En la mayoría de los casos sí, pero debes notificarnos con anticipación. Algunos eventos pueden tener restricciones específicas sobre transferencias.'
    },
    {
      pregunta: '¿Qué pasa si el evento se cancela?',
      respuesta: 'Si un evento se cancela, te notificaremos inmediatamente y procesaremos el reembolso completo. El tiempo de procesamiento puede variar según tu método de pago original.'
    }
  ];

  preguntaAbierta: number | null = null;

  ngOnInit(): void {
    // Scroll al inicio de la página cuando se carga
    window.scrollTo(0, 0);
  }

  togglePregunta(index: number): void {
    this.preguntaAbierta = this.preguntaAbierta === index ? null : index;
  }
}
