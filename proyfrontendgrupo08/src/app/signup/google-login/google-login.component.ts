import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service'; // Ajusta la ruta si es necesario

declare const google: any;

@Component({
  selector: 'app-google-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-login.component.html',
  styleUrl: './google-login.component.css'
})
export class GoogleLoginComponent implements OnInit {
  
  errorMessage: string | null = null;

  constructor(
    private ngZone: NgZone,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
        this.loadGoogleScript();
        (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
    }
  }

  private loadGoogleScript(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  handleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      const decodedToken = this.decodeJwtResponse(response.credential);
      this.errorMessage = null; // Limpiar errores previos
      
      this.authService.googleLogin(decodedToken).subscribe({
        next: (user) => {
          this.router.navigate(['/inicio']);
        },
        error: (err: Error) => {
          // ✅ MOSTRAR EL ERROR ESPECÍFICO DEL BACKEND
          this.errorMessage = err.message;
        }
      });
    });
  }
  
  private decodeJwtResponse(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}