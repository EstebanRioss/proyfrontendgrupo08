import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Entrada } from '../models/entrada';
import { EntradaService } from '../service/entrada.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-lista-entradas',
  imports: [CommonModule],
  templateUrl: './lista-entradas.component.html',
  styleUrl: './lista-entradas.component.css'
})
export class ListaEntradasComponent {
  Entradas: Entrada[] = [];
isLoading = true;
errorMsg: string | null = null;
currentUser: Usuario | null = null;

constructor(
  private service: EntradaService,
  private router: Router,
  private authService: AuthService
) { }

ngOnInit(): void {
  // guardamos al usuario si lo necesitás para lógica de rol
  this.authService.currentUser.subscribe(user => this.currentUser = user);
  this.cargarEntradas();
}

private cargarEntradas(): void {
  this.isLoading = true;

  // • Admin → todas las entradas
  // • Usuario normal → sólo sus entradas
  const fuente$ = (this.currentUser?.rol === "administrador")
    ? this.service.getEntradas()
    : this.service.getMisEntradas();

  fuente$.subscribe({
    next: (entradas) => {
      this.Entradas = entradas;
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMsg = err.message || 'No se pudieron cargar las entradas.';
      this.isLoading = false;
    }
  });
}

// ---------- Acciones ----------

Crear(): void {
  // Ruta al formulario de alta (si lo tenés)
  this.router.navigate(['entrada/nueva']);
}

Modificar(e: Entrada): void {
  this.router.navigate(['entrada/editar', e._id]);
}

Eliminar(e: Entrada): void {
  if (!confirm(`¿Eliminar la entrada "${e.nombre}"?`)) return;

  this.service.deleteEntrada(e._id!).subscribe({
    next: () => {
      alert('Entrada eliminada correctamente.');
      this.cargarEntradas();
    },
    error: (err) =>
      alert('Error: ' + (err.error?.msg || err.message))
  });
}

// ---------- Utilidades para mostrar datos del evento ----------

getEventoNombre(entrada: Entrada): string {
  const evento = entrada.eventoId;
  return typeof evento === 'object' && evento?.nombre
    ? evento.nombre
    : (typeof evento === 'string' ? evento : 'Evento no disponible');
}

getEventoLink(entrada: Entrada): any[] | null {
  const evento = entrada.eventoId;
  return (typeof evento === 'object' && evento?._id)
    ? ['/evento', evento._id]
    : null;
}
}
