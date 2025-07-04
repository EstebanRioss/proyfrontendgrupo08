import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { EventosService } from '../service/eventos.service';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-evento',
  imports: [CommonModule],
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

  constructor(private activatedRoute : ActivatedRoute,private serviceE : EventosService,private sanitizer: DomSanitizer){
    this.cargarEvento();
  }

  cargarEvento(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.serviceE.getEvento(this.id).subscribe(result => {
        if (result) {
          // Asignar correctamente los datos
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

}
