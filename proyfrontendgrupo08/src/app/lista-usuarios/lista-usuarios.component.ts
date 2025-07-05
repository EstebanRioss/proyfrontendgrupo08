import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../service/usuario.service';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit, OnDestroy {
  
  Usuarios: Array<Usuario> = [];
  isLoading = true;
  error: string | null = null;
  
  private userSubscription!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getUsuarios(): void {
    this.isLoading = true;
    this.error = null;
    this.usuarioService.getUsuarios().subscribe({
      next: (result: Usuario[]) => {
        const currentUser = this.authService.currentUserValue;
        // Filtramos para no mostrar al administrador actual en su propia lista
        this.Usuarios = result.filter(user => user._id !== currentUser?._id);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar usuarios:", err);
        this.error = "No se pudieron cargar los usuarios. Inténtalo de nuevo.";
        this.isLoading = false;
      }
    });
  }

  /**
   * Redirige al formulario para editar un usuario.
   * @param u El usuario a modificar.
   */
  Modificar(u: Usuario): void {
    // Navega a la ruta de edición, pasando el ID del usuario.
    this.router.navigate(['/admin/usuarios/editar', u._id]);
  }

  /**
   * Desactiva un usuario después de una confirmación.
   * @param u El usuario a desactivar.
   */
  Eliminar(u: Usuario): void {
    const confirmacion = confirm(`¿Estás seguro de que quieres desactivar al usuario ${u.nombre} ${u.apellido}?`);
    
    if (confirmacion) {
      this.usuarioService.deleteUsuario(u._id).subscribe({
        next: (res) => {
          alert(res.msg || 'Usuario desactivado correctamente.');
          // Vuelve a cargar la lista para reflejar el cambio.
          this.getUsuarios(); 
        },
        error: (err) => {
          console.error("Error al desactivar:", err);
          alert(err.error?.msg || 'Error al desactivar el usuario.');
        }
      });
    }
  }
}
