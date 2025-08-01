import { Component } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { passwordMatchValidator } from '../mi-cuenta.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos-personales',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css'
})
export class DatosPersonalesComponent {
  usuario: Usuario | null = null;
  updateForm: FormGroup;
  passwordForm: FormGroup; // Formulario para la contraseña

  // Mensajes y estados para el formulario de perfil
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  isLoading: boolean = false;

  // Mensajes y estados para el formulario de contraseña
  mensajeExitoPass: string | null = null;
  mensajeErrorPass: string | null = null;
  isPasswordLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // Formulario para datos del perfil
    this.updateForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern('^[0-9]{9,15}$')]]
    });

    // Formulario para cambiar contraseña
    this.passwordForm = this.fb.group({
      contrasenaActual: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]], // <- Cambiar el 8 por un 6 acá
      confirmarContrasena: ['', [Validators.required]]
}, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.usuario = user;
        // La propiedad 'googleId' debería venir del backend para que esto funcione siempre.
        this.updateForm.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: user.telefono
        });
      }
    });
  }

  // Lógica para actualizar datos del perfil
  onSubmit(): void {
    if (this.updateForm.invalid || !this.usuario?._id) {
      this.updateForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.mensajeExito = null;
    this.mensajeError = null;
    this.authService.updateUsuario(this.usuario._id, this.updateForm.value).subscribe({
      next: (response) => {
        this.mensajeExito = response.msg;
        this.isLoading = false;
      },
      error: (err) => {
        this.mensajeError = err.message;
        this.isLoading = false;
      }
    });
  }

  // Lógica para cambiar la contraseña
  onPasswordSubmit(): void {
    if (this.passwordForm.invalid || !this.usuario?._id) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.isPasswordLoading = true;
    this.mensajeExitoPass = null;
    this.mensajeErrorPass = null;
    const { contrasenaActual, nuevaContrasena } = this.passwordForm.value;

    this.authService.cambiarContrasena(this.usuario._id, { contrasenaActual, nuevaContrasena }).subscribe({
      next: (response) => {
        this.mensajeExitoPass = response.msg;
        this.isPasswordLoading = false;
        this.passwordForm.reset();
      },
      error: (err) => {
        this.mensajeErrorPass = err.message;
        this.isPasswordLoading = false;
      }
    });
  }

  // Getters para el formulario de perfil
  get nombre() { return this.updateForm.get('nombre'); }
  get apellido() { return this.updateForm.get('apellido'); }
  get telefono() { return this.updateForm.get('telefono'); }

  // Getters para el formulario de contraseña
  get contrasenaActual() { return this.passwordForm.get('contrasenaActual'); }
  get nuevaContrasena() { return this.passwordForm.get('nuevaContrasena'); }
  get confirmarContrasena() { return this.passwordForm.get('confirmarContrasena'); }
} 
