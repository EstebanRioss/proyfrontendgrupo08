import { Component } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Evento } from '../models/evento';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { EventosService } from '../service/eventos.service';
import { UsuarioService } from '../service/usuario.service';
import { Router } from '@angular/router';
import { Entrada } from '../models/entrada';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { MpService } from '../service/mp.service';
import { CarritoService } from '../service/carrito.service';
import { Usuario } from '../models/usuario';
import { CategoriaEvento } from '../models/categoria-evento';
import { CategoriaService } from '../service/categoria.service';

@Component({
  selector: 'app-evento',
  imports: [CommonModule,FormsModule],
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
  entradaSeleccionada: Entrada | null = null;
  cantidadSeleccionada: number = 1;
  currentUser: any = null;
  cantidadOpciones: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  cantidadesSeleccionadas: number[] = [];
  mensajeError: string = '';
  entradasDisponibles = 0;
  categoriaNombre: string = 'Sin categoria';
  organizadorNombre: string = 'Sin nombre';
  today: any;


  constructor(private serviceU :UsuarioService,private serviceC : CategoriaService,private carritoService : CarritoService,private mpService : MpService,private activatedRoute : ActivatedRoute,private serviceE : EventosService,private sanitizer: DomSanitizer,private router : Router, private authService : AuthService){
    this.currentUser = this.authService.currentUserValue;
    this.cargarEvento();
    this.cantidadesSeleccionadas = this.evento?.entradas?.map(() => 0) || [];
    window.scrollTo(0, 0);
  }

  comprarEntrada(): void {

    this.mensajeError = '';

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.entradaSeleccionada) {
      this.mensajeError = 'Seleccioná un tipo de entrada.';
      return;
    }

    if (!this.cantidadSeleccionada || this.cantidadSeleccionada < 1) {
      this.mensajeError = 'Seleccioná una cantidad válida.';
      return;
    }

    this.mpService.comprarEntradas(
      this.evento._id!,
      this.currentUser._id,
      this.entradaSeleccionada.tipo!,
      this.cantidadSeleccionada,
      this.entradaSeleccionada.precio!,
      this.evento.nombre!,
      this.evento.descripcion!,
      this.evento.imagenUrl!
    ).subscribe({
      next: (resp) => {
        window.location.href = resp.initPoint; // redirige al link de pago MercadoPago
      },
      error: () => {
        this.mensajeError = 'Error al iniciar la compra. Intenta más tarde.';
      }
    });

  }

  agregarAlCarrito() {
    this.mensajeError = '';

    if (!this.entradaSeleccionada || !this.cantidadSeleccionada) {
      this.mensajeError = 'Seleccioná tipo y cantidad.';
      return;
    }

    this.carritoService.agregarAlCarrito({
      tipoEntrada: this.entradaSeleccionada!.tipo!,
      precio: this.entradaSeleccionada!.precio!,
      cantidad: this.cantidadSeleccionada,
      eventoId: this.evento._id!,
      nombreEvento: this.evento.nombre!
    });
  }

  traducirFecha(fecha: Date): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const diaSemana = dias[fecha.getDay()];
    const diaMes = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return `${diaSemana}, ${diaMes} de ${mes} de ${anio}`;
  }

  getDia(fecha: Date): string {
    return fecha.getDate().toString().padStart(2, '0');
  }

  getMes(fecha: Date): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[fecha.getMonth()];
  }

  getDiaSemana(fecha: Date): string {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dias[fecha.getDay()];
  }

  cargarEvento(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.serviceE.getEvento(this.id).subscribe(result => {
        if (result) {
          const fechaDate = new Date(result.fecha);
          // Asignar correctamente los datos
          this.evento = {
            ...result,
            fecha: fechaDate, // se mantiene como Date para pipes
            fechaFormateada: this.traducirFecha(fechaDate),
            dia: this.getDia(fechaDate),
            mes: this.getMes(fechaDate),
            diaSemana: this.getDiaSemana(fechaDate) // Convertir fecha correctamente
          };

          // Solo si hay lat/lng se genera la URL segura
          if (this.evento.latitud && this.evento.longitud) {
            const url = `https://maps.google.com/maps?q=${this.evento.latitud},${this.evento.longitud}&z=15&output=embed`;
            this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
          this.entradasDisponibles = this.evento.stock!;
          this.iniciarCountdown();
        } else {
          console.error('Evento no encontrado.');
        }
      });
    });
  }
  getNombreOrganizador(evento: Evento): string {
      if (typeof evento.organizadorId === 'string') return evento.organizadorId;
      return evento.organizadorId?.nombre || 'Sin nombre';
    }

    getNombreCategoria(evento: Evento): string {
      if (typeof evento.categoriaId === 'string') return evento.categoriaId;
      return evento.categoriaId?.nombre || 'Sin categoría';
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
