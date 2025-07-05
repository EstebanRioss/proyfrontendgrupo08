import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { AuthService } from '../service/auth.service';
import { EmailService, EmailVerificationResponse } from '../service/email.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UsuarioService } from '../service/usuario.service';
import { of } from 'rxjs'; // Import 'of' from 'rxjs' for the EmailService changes if needed elsewhere, but not directly used in this component's new logic

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
      rol: new FormControl('usuario', [Validators.required]), // Default to 'usuario'
      telefono: new FormControl('')
    });
  }

  ngOnInit(): void {
    // We removed the email valueChanges subscription from here
    // as verification will now happen on form submission.
  }

  onCodigoSubmit() {
    if (this.codigoForm.invalid) {
      // Mark all controls as touched to display validation errors
      this.codigoForm.markAllAsTouched();
      return;
    }

    this.isCheckingCodigo = true;
    this.codigoError = ''; // Clear previous errors
    const codigoIngresado = this.codigoForm.value.codigo;

    // Call backend to confirm the code
    this.serviceU.confirmarUsuario(codigoIngresado)
      .subscribe({
        next: res => {
          this.isCheckingCodigo = false;
          alert('Cuenta verificada con éxito');
          // You can redirect or show something else here, e.g., navigate to login
          // this.router.navigate(['/login']);
        },
        error: err => {
          this.isCheckingCodigo = false;
          this.codigoError = err.error.message || 'Código incorrecto. Inténtalo de nuevo.';
        }
      });
  }

  onRegisterSubmit(): void {
    // Mark all controls as touched to display validation errors
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.errorMessage = "Por favor, completa todos los campos requeridos correctamente.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.isEmailValidAndDeliverable = false; // Reset email validity flag

    const email = this.registerForm.get('email')?.value;

    // Perform email verification before attempting registration
    this.isVerifyingEmail = true;
    this.emailVerificationMsg = 'Verificando email...';

    this.emailService.verifyEmail(email).subscribe({
      next: (response: EmailVerificationResponse | null) => {
        this.isVerifyingEmail = false;
        if (response && response.is_deliverable) {
          this.isEmailValidAndDeliverable = true;
          this.emailVerificationMsg = 'El email es válido.';
          // Proceed with registration if email is valid and deliverable
          this.performRegistration();
        } else {
          this.isEmailValidAndDeliverable = false;
          this.emailVerificationMsg = response?.did_you_mean
            ? `Email no válido. ¿Quisiste decir ${response.did_you_mean}?`
            : 'El email no parece ser válido o no se puede entregar.';
          this.isLoading = false; // Stop loading if email is not valid
          this.errorMessage = this.emailVerificationMsg; // Show as error for submission
        }
      },
      error: (err) => {
        this.isVerifyingEmail = false;
        this.isEmailValidAndDeliverable = false;
        this.emailVerificationMsg = 'Error al verificar el email. Por favor, inténtalo de nuevo.';
        this.errorMessage = 'Hubo un problema al verificar tu email. Inténtalo más tarde.';
        this.isLoading = false; // Stop loading on error
      }
    });
  }

  private performRegistration(): void {
    const userData = { ...this.registerForm.value };
    userData.rol = 'usuario';
    if (!userData.telefono) {
      delete userData.telefono;
    }

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.msg;
        this.registerForm.reset({ rol: 'usuario' });
        this.isEmailValidAndDeliverable = false;
        this.emailVerificationMsg = null;
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }
}