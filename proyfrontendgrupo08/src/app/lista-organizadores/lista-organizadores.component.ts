import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../service/usuario.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-lista-organizadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-organizadores.component.html',
  styleUrls: ['./lista-organizadores.component.css']
})
export class ListaOrganizadoresComponent implements OnInit {

  organizadoresPendientes: Array<Usuario> = [];
  isLoading = true;
  error: string | null = null;
  
  // Para el modal de detalles
  organizadorSeleccionado: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarOrganizadoresPendientes();
  }

  /**
   * Carga todos los usuarios y filtra solo los organizadores pendientes.
   */
  cargarOrganizadoresPendientes(): void {
    this.isLoading = true;
    this.error = null;

    // --- CORRECCIÓN ---
    // La llamada a getUsuarios() ya no necesita el token como argumento.
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.organizadoresPendientes = usuarios.filter(user => 
          user.rol === 'organizador' && user.estadoAprobacion === 'pendiente'
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'No se pudieron cargar las solicitudes. Inténtalo más tarde.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Llama al servicio para aprobar el rol de un organizador.
   * @param usuarioId El ID del usuario a aprobar.
   */
  aprobarOrganizador(usuarioId: string): void {
    if (!confirm('¿Estás seguro de que quieres aprobar a este organizador?')) {
      return;
    }

    this.authService.aprobarRol(usuarioId).subscribe({
      next: (res) => {
        alert('Organizador aprobado con éxito.');
        // Recargamos la lista para que el usuario aprobado desaparezca de los pendientes.
        this.cargarOrganizadoresPendientes();
      },
      error: (err) => {
        console.error('Error al aprobar organizador:', err);
        alert('Hubo un error al aprobar la solicitud.');
      }
    });
  }

  /**
   * Cambia el estado de aprobación a 'rechazado'.
   * @param usuario El usuario a rechazar.
   */
  rechazarOrganizador(usuario: Usuario): void {
     if (!confirm(`¿Estás seguro de que quieres rechazar la solicitud de ${usuario.nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }
    
    this.authService.updateUsuario(usuario._id, { estadoAprobacion: 'rechazado' }).subscribe({
      next: () => {
        alert('La solicitud del organizador ha sido rechazada.');
        this.cargarOrganizadoresPendientes(); // Recargar la lista
      },
      error: (err) => {
        console.error('Error al rechazar organizador:', err);
        alert('Hubo un error al rechazar la solicitud.');
      }
    });
  }

  /**
   * Muestra un modal con los detalles completos del organizador.
   * @param organizador El objeto del organizador a mostrar.
   */
  verDetalles(organizador: Usuario): void {
    this.organizadorSeleccionado = organizador;
  }

  /**
   * Cierra el modal de detalles.
   */
  cerrarDetalles(): void {
    this.organizadorSeleccionado = null;
  }
}
