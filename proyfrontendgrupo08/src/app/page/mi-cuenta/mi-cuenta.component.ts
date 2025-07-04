import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MisEntradasComponent } from './mis-entradas/mis-entradas.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { AsideCuentaComponent } from './aside-cuenta/aside-cuenta.component';

// Validador personalizado para asegurar que las contraseñas coincidan
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('nuevaContrasena');
  const confirmPassword = control.get('confirmarContrasena');
  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MisEntradasComponent, DatosPersonalesComponent,AsideCuentaComponent],
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit {
  currentUser: Usuario | null = null;
  private userSubscription!: Subscription;
  selectedOption: string = 'datos';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onOptionSelected(option: string): void {
    this.selectedOption = option;
  }

}
