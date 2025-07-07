import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  imports: [CommonModule, RouterModule],
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.css'
})
export class TerminosCondicionesComponent {
  ultimaActualizacion = '15 de Enero, 2025';
  
  secciones = [
    {
      titulo: '1. Aceptación de los Términos',
      contenido: 'Al acceder y utilizar Paseshow, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.'
    },
    {
      titulo: '2. Descripción del Servicio',
      contenido: 'Paseshow es una plataforma de venta de entradas para eventos que conecta organizadores de eventos con el público. Facilitamos la compra y venta de entradas de manera segura y confiable.'
    },
    {
      titulo: '3. Registro de Usuario',
      contenido: 'Para utilizar ciertos servicios, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tu información de acceso y de todas las actividades que ocurran bajo tu cuenta.'
    },
    {
      titulo: '4. Compra de Entradas',
      contenido: 'Al comprar entradas a través de Paseshow, confirmas que tienes la autoridad legal para realizar la compra. Los precios están sujetos a cambios sin previo aviso hasta que se complete la transacción.'
    },
    {
      titulo: '5. Política de Reembolsos',
      contenido: 'Las entradas compradas a través de Paseshow no son reembolsables, excepto en casos de cancelación del evento por parte del organizador. En caso de cancelación, se procesará el reembolso completo.'
    },
    {
      titulo: '6. Uso Aceptable',
      contenido: 'Te comprometes a utilizar Paseshow solo para fines legales y de acuerdo con estos términos. Está prohibido el uso fraudulento, la reventa no autorizada de entradas, o cualquier actividad que pueda dañar el servicio.'
    },
    {
      titulo: '7. Privacidad',
      contenido: 'Tu privacidad es importante para nosotros. Nuestra política de privacidad describe cómo recopilamos, usamos y protegemos tu información personal. Al usar nuestro servicio, aceptas nuestras prácticas de privacidad.'
    },
    {
      titulo: '8. Propiedad Intelectual',
      contenido: 'Todo el contenido de Paseshow, incluyendo textos, gráficos, logos, imágenes y software, está protegido por derechos de autor y otras leyes de propiedad intelectual. No está permitida la reproducción sin autorización.'
    },
    {
      titulo: '9. Limitación de Responsabilidad',
      contenido: 'Paseshow no será responsable por daños indirectos, incidentales o consecuentes que puedan resultar del uso de nuestro servicio. Nuestra responsabilidad total está limitada al monto pagado por el servicio.'
    },
    {
      titulo: '10. Modificaciones',
      contenido: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación. Te recomendamos revisar estos términos periódicamente.'
    },
    {
      titulo: '11. Ley Aplicable',
      contenido: 'Estos términos se rigen por las leyes de Argentina. Cualquier disputa será resuelta en los tribunales competentes de la jurisdicción correspondiente.'
    },
    {
      titulo: '12. Contacto',
      contenido: 'Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos a través de info@paseshow.com.ar o utilizando los canales de contacto disponibles en nuestra plataforma.'
    }
  ];

  ngOnInit(): void {
    // Scroll al inicio de la página cuando se carga
    window.scrollTo(0, 0);
  }
}
