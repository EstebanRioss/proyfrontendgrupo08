import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { EmailService, EmailVerificationResponse } from '../../service/email.service';

@Component({
  selector: 'app-form-organizador',
  standalone: true,
  imports: [CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './form-organizador.component.html',
  styleUrls: ['./form-organizador.component.css']
})
export class FormOrganizadorComponent implements OnInit {

  organizadorForm!: FormGroup;
  codigoForm!: FormGroup;

  // --- Estados de la UI ---
  isLoading = false;
  isCheckingCodigo = false;

  // --- Mensajes para el usuario ---
  errorMessage: string | null = null;
  successMessage: string | null = null;
  codigoError: string | null = null;

  // --- Estados de la verificación de email ---
  isVerifyingEmail = false;
  emailVerificationMsg: string | null = null;
  isEmailValidAndDeliverable = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private emailService: EmailService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicializa el formulario de registro del organizador con todas las validaciones
    this.organizadorForm = this.fb.group({
      // --- Datos personales ---
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9\s-()+]{8,15}$/)]],
      
      // --- Datos de la organización ---
      nombreEmpresa: ['', [Validators.required]],
      cuit: ['', [Validators.required, Validators.pattern(/^(20|23|24|27|30|33|34)-[0-9]{8}-[0-9]$/)]],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],

      // --- Datos de acceso ---
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Inicializa el formulario para el código de confirmación
    this.codigoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  /**
   * Se ejecuta al enviar el formulario de registro.
   * Verifica el email y si es válido, procede con el registro.
   */
  onRegisterSubmit(): void {
    this.organizadorForm.markAllAsTouched();
    if (this.organizadorForm.invalid) {
      this.errorMessage = "Por favor, completa todos los campos requeridos correctamente.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.isEmailValidAndDeliverable = false;
    this.isVerifyingEmail = true;
    this.emailVerificationMsg = 'Verificando validez del correo...';

    const email = this.organizadorForm.get('email')?.value;

    this.emailService.verifyEmail(email).subscribe({
      next: (response: EmailVerificationResponse | null) => {
        this.isVerifyingEmail = false;
        if (response && response.is_deliverable) {
          this.isEmailValidAndDeliverable = true;
          this.emailVerificationMsg = 'El correo es válido y puede recibir mensajes.';
          this.performRegistration();
        } else {
          this.isLoading = false;
          this.isEmailValidAndDeliverable = false;
          this.emailVerificationMsg = response?.did_you_mean
            ? `Correo no válido. ¿Quisiste decir ${response.did_you_mean}?`
            : 'El correo no parece ser válido o no se puede entregar.';
          this.errorMessage = this.emailVerificationMsg;
        }
      },
      error: () => {
        // En caso de que la API de verificación falle, permitimos continuar
        // pero informamos al usuario. El backend hará la validación final.
        this.isVerifyingEmail = false;
        this.isEmailValidAndDeliverable = true; // Se asume verdadero para poder continuar
        this.emailVerificationMsg = 'No se pudo verificar el correo en tiempo real. Se continuará con el registro.';
        this.performRegistration();
      }
    });
  }

  /**
   * Llama al servicio de autenticación para registrar al usuario como organizador.
   */
  private performRegistration(): void {
    const userData = { ...this.organizadorForm.value };
    userData.rol = 'organizador'; // Asignación clave del rol

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.msg;
        this.organizadorForm.reset();
        this.emailVerificationMsg = null;
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }

  /**
   * Se ejecuta al enviar el formulario con el código de confirmación.
   */
  onCodigoSubmit(): void {
    this.codigoForm.markAllAsTouched();
    if (this.codigoForm.invalid) {
      return;
    }

    this.isCheckingCodigo = true;
    this.codigoError = null;
    const codigoIngresado = this.codigoForm.value.codigo;

    this.authService.confirmarEmail(codigoIngresado).subscribe({
      next: (res) => {
        this.isCheckingCodigo = false;
        alert(res.msg + ' Serás redirigido a la página de inicio.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isCheckingCodigo = false;
        this.codigoError = err.message || 'Código incorrecto o expirado. Inténtalo de nuevo.';
      }
    });
  }
}
