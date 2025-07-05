import { Component, OnInit } from '@angular/core';
import { Entrada } from '../../models/entrada';
import { AuthService } from '../../service/auth.service';
import { EntradaService } from '../../service/entrada.service';

interface EntradasAgrupadas {
  pendientes: Entrada[];
  proximos: Entrada[];
  pasados: Entrada[];
}

@Component({
  selector: 'app-mis-entradas',
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css']
})
export class MisEntradasComponent implements OnInit {

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
    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId) {
      this.errorMsg = 'No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.';
      this.isLoading = false;
      return;
    }

    this.entradaService.getEntradasPorUsuario(usuarioId).subscribe({
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
        // Aseguramos que eventoId y su fecha existan y sean del tipo correcto
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
}


