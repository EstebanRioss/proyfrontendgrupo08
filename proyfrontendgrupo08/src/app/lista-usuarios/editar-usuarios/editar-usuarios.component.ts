import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-editar-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {

  usuarioForm!: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  isLoading = true;
  error: string | null = null;
  pageTitle = 'Editar Usuario';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      telefono: [''],
      rol: ['usuario', Validators.required],
      estado: [true] // El valor por defecto es 'activo'
    });

    if (this.isEditMode && this.userId) {
      this.loadUserData(this.userId);
    } else {
      this.router.navigate(['/admin/usuarios']);
    }
  }

  loadUserData(id: string): void {
    this.isLoading = true;
    this.usuarioService.getUsuario(id).subscribe({
      next: (user: Usuario) => {
        this.usuarioForm.patchValue(user);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el usuario:', err);
        this.error = 'No se pudo cargar la información del usuario.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.userId) {
      // Usamos getRawValue() para incluir los campos deshabilitados como 'email'
      const formData = this.usuarioForm.getRawValue(); 
      this.usuarioService.updateUsuario(this.userId, formData).subscribe({
        next: () => {
          alert('Usuario actualizado con éxito.');
          this.router.navigate(['/gestion']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.error = err.error?.msg || 'Ocurrió un error al actualizar el usuario.';
        }
      });
    }
  }
}