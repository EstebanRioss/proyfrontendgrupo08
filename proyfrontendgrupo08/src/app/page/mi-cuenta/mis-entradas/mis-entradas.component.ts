import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { EntradaService } from '../../../service/entrada.service';
import { Entrada } from '../../../models/entrada';
import { RouterModule } from '@angular/router';

interface EntradasAgrupadas {
  pendientes: Entrada[];
  proximos: Entrada[];
  pasados: Entrada[];
}

@Component({
  selector: 'app-mis-entradas',
  imports: [CommonModule,RouterModule],
  templateUrl: './mis-entradas.component.html',
  styleUrl: './mis-entradas.component.css'
})
export class MisEntradasComponent implements OnInit{
  entradasAgrupadas: EntradasAgrupadas = { pendientes: [], proximos: [], pasados: [] };
isLoading = true;
errorMsg: string | null = null;

constructor(
  private authService: AuthService,
  private entradaService: EntradaService
) { }

ngOnInit(): void {
  this.cargarEntradas();
}

cargarEntradas(): void {
  const token = this.authService.getToken();

  if (!token) {
    this.errorMsg = 'No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.';
    this.isLoading = false;
    return;
  }

  this.entradaService.getMisEntradas().subscribe({
    next: (entradas) => {
      this.agruparEntradas(entradas);
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMsg = err.message || 'No se pudieron cargar tus entradas.';
      this.isLoading = false;
    }
  });
}

private agruparEntradas(entradas: Entrada[]): void {
  const ahora = new Date();
  const grupos: EntradasAgrupadas = { pendientes: [], proximos: [], pasados: [] };

  for (const entrada of entradas) {
    if (entrada.estado === 'pendiente') {
      grupos.pendientes.push(entrada);
    } else {
      const eventoFecha = (typeof entrada.eventoId === 'object' && entrada.eventoId?.fecha) 
                            ? new Date(entrada.eventoId.fecha) 
                            : null;

      if (eventoFecha && eventoFecha > ahora) {
        grupos.proximos.push(entrada);
      } else {
        grupos.pasados.push(entrada);
      }
    }
  }

  this.entradasAgrupadas = grupos;
}

getEventoNombre(entrada: any): string {
  const evento = entrada.eventoId;
  return typeof evento === 'object' && evento?.nombre ? evento.nombre : 'Evento no disponible';
}

getEventoFecha(entrada: any): string {
  const evento = entrada.eventoId;
  if (typeof evento === 'object' && evento?.fecha) {
    return new Date(evento.fecha).toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  return 'Fecha no disponible';
}

getEventoUbicacion(entrada: any): string {
  const evento = entrada.eventoId;
  return typeof evento === 'object' && evento?.ubicacionNombre ? evento.ubicacionNombre : 'Ubicación no disponible';
}

getEventoLink(entrada: any): any[] | null {
  const evento = entrada.eventoId;
  if (typeof evento === 'object' && evento?._id) {
    return ['/evento', evento._id];
  }
  return null;
}
}
