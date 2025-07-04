import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { AuthService } from '../service/auth.service';
import { EmailService, EmailVerificationResponse } from '../service/email.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    GoogleLoginComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../login/login.component.css']
})
export class SignupComponent implements OnInit {

  codigoForm!: FormGroup;
  codigoError: string = '';
  isCheckingCodigo = false;
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isVerifyingEmail = false;
  emailVerificationMsg: string | null = null;
  isEmailValidAndDeliverable = false;

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private serviceU : UsuarioService,
    private fb: FormBuilder
  ) {
    this.codigoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rol: new FormControl('usuario', [Validators.required]),
      telefono: new FormControl('') 
    });
  }

  ngOnInit(): void {
    this.onEmailChanges();
  }

  onCodigoSubmit() {
  if (this.codigoForm.invalid) return;

  this.isCheckingCodigo = true;
  const codigoIngresado = this.codigoForm.value.codigo;

  // Llamada al backend para confirmar el código
  this.serviceU.confirmarUsuario(codigoIngresado)
    .subscribe({
      next: res => {
        this.isCheckingCodigo = false;
        alert('Cuenta verificada con éxito');
        // Podés redirigir o mostrar otra cosa aquí
      },
      error: err => {
        this.isCheckingCodigo = false;
        this.codigoError = err.error.message || 'Código incorrecto.';
      }
    });
  }

  private onEmailChanges(): void {
    this.registerForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.isVerifyingEmail = true;
        this.isEmailValidAndDeliverable = false;
        this.emailVerificationMsg = 'Verificando email...';
      }),
      switchMap(email => {
        if (this.registerForm.get('email')?.valid) {
          return this.emailService.verifyEmail(email);
        }
        this.isVerifyingEmail = false;
        this.emailVerificationMsg = null;
        return [];
      })
    ).subscribe((response: EmailVerificationResponse | null) => {
      this.isVerifyingEmail = false;
      if (response && response.is_deliverable) {
          this.isEmailValidAndDeliverable = true;
          this.emailVerificationMsg = 'El email es válido.';
      } else {
          this.isEmailValidAndDeliverable = false;
          this.emailVerificationMsg = response?.did_you_mean 
            ? `Email no válido. ¿Quisiste decir ${response.did_you_mean}?`
            : 'El email no parece ser válido o no se puede entregar.';
      }
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    if (!this.isEmailValidAndDeliverable) {
        this.errorMessage = "Por favor, usa una dirección de email válida y verificable.";
        return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const userData = { ...this.registerForm.value };

    if (!userData.telefono) {
      delete userData.telefono;
    }

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.msg; 
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }
}