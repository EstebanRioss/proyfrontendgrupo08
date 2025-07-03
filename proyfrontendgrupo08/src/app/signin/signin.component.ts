import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { AuthService } from '../service/auth.service';
import { EmailService, EmailVerificationResponse } from '../service/email.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    GoogleLoginComponent
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css', '../login/login.component.css']
})
export class SigninComponent implements OnInit {

  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isVerifyingEmail = false;
  emailVerificationMsg: string | null = null;
  isEmailValidAndDeliverable = false;

  constructor(
    private authService: AuthService,
    private emailService: EmailService
  ) {
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