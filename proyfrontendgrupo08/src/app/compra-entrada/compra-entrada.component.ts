import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../service/auth.service';
import { EventosService } from '../service/eventos.service';
import { EntradaService } from '../service/entrada.service';

@Component({
  selector: 'app-evento',
  imports: [CommonModule], // 'standalone' es false, así que no se usa 'imports' aquí. Se declara en el NgModule.
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent {

  evento: Evento = {} as Evento;
  countdown: { dias: number; horas: number; minutos: number; segundos: number } | null = null;
  id : string = "";
  mapaUrl: SafeResourceUrl | null = null;
  categoria: string = "";
  organizador: string = "";
  compraEnProgreso = false;
  mensajeCompra = '';

  constructor(
    private activatedRoute : ActivatedRoute,
    private serviceE : EventosService,
    private sanitizer: DomSanitizer,
    private entradaService: EntradaService,
    public authService: AuthService // Público para usarlo en el template
  ){
    this.cargarEvento();
  }

  cargarEvento(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.serviceE.getEvento(this.id).subscribe(result => {
        if (result) {
          // Asignar correctamente los datos y el _id
          this.evento = {
            ...result,
            fecha: new Date(result.fecha) // Convertir fecha correctamente
          };

          // Solo si hay lat/lng se genera la URL segura
          if (this.evento.latitud && this.evento.longitud) {
            const url = `https://maps.google.com/maps?q=${this.evento.latitud},${this.evento.longitud}&z=15&output=embed`;
            this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
          this.iniciarCountdown();
        } else {
          console.error('Evento no encontrado.');
        }
      });
    });
  }

  iniciarCountdown(): void {
    if (!this.evento || !this.evento.fecha) return;
    const fechaEvento = new Date(this.evento.fecha).getTime();

    const actualizar = () => {
      const ahora = Date.now();
      const diferencia = fechaEvento - ahora;

      if (diferencia > 0) {
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
        const segundos = Math.floor((diferencia / 1000) % 60);
        this.countdown = { dias, horas, minutos, segundos };
      } else {
        this.countdown = null;
      }
    };

    actualizar();
    setInterval(actualizar, 1000);
  }

  isEventoPasado(): boolean {
    if (!this.evento || !this.evento.fecha) {
        return false;
    }
    return new Date(this.evento.fecha).getTime() < Date.now();
  }

  comprarEntrada(): void {
    if (!this.authService.isLoggedIn()) {
        this.mensajeCompra = 'Debes iniciar sesión para comprar una entrada.';
        // Opcional: Redirigir a login
        // this.router.navigate(['/login']);
        return;
    }

    if (!this.evento._id) { // Usamos _id que viene de MongoDB
        this.mensajeCompra = 'Error: No se pudo identificar el evento.';
        return;
    }

    this.compraEnProgreso = true;
    this.mensajeCompra = '';

    const entradaData = {
        eventoId: this.evento._id,
        cantidad: 1 // Por ahora, compramos 1 entrada. Esto podría venir de un input.
    };

    this.entradaService.createEntrada(entradaData).subscribe({
        next: (respuesta) => {
            this.compraEnProgreso = false;
            this.mensajeCompra = '¡Solicitud registrada! Serás redirigido para completar el pago.';
            // Aquí iría la lógica para redirigir a la pasarela de pago (ej. MercadoPago)
            // if (respuesta.init_point) window.location.href = respuesta.init_point;
        },
        error: (err) => {
            this.compraEnProgreso = false;
            this.mensajeCompra = err.message || 'Hubo un error al procesar tu compra.';
        }
    });
  }
}
