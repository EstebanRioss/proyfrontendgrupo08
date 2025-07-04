import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit {

  usuario: Usuario | null = null;
  updateForm: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern('^[0-9]{9,15}$')]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.usuario = user;
        this.updateForm.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: user.telefono
        });
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.usuario?._id) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.mensajeExito = null;
    this.mensajeError = null;

    const datosActualizados = this.updateForm.value;

    this.authService.updateUsuario(this.usuario._id, datosActualizados).subscribe({
      next: (response) => {
        this.mensajeExito = response.msg;
        this.isLoading = false;
      },
      error: (err) => {
        this.mensajeError = err.message || 'Error al actualizar los datos.';
        this.isLoading = false;
      }
    });
  }

  get nombre() { return this.updateForm.get('nombre'); }
  get apellido() { return this.updateForm.get('apellido'); }
  get telefono() { return this.updateForm.get('telefono'); }
}