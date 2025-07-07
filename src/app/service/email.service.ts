import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para tipar la respuesta de la API de verificación
export interface EmailVerificationResponse {
  email: string;
  did_you_mean: string;
  user: string;
  domain: string;
  syntax_valid: boolean;
  is_disposable: boolean;
  is_role_account: boolean;
  is_catch_all: boolean;
  is_deliverable: boolean;
  free: boolean;
  score: number;
}


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiKey = "nAbgvIyEZuhnBCEkgSwkZhPxIY0kvj0H"; // Tu API Key
  private apiUrl = "https://api.apilayer.com/email_verification/";

  constructor(private http: HttpClient) { }

  /**
   * Verifica una dirección de correo electrónico usando la API de APILayer.
   * @param email El correo electrónico a verificar.
   * @returns Un Observable con la respuesta de la API.
   */
  verifyEmail(email: string): Observable<EmailVerificationResponse | null> {
    if (!email) {
      return of(null);
    }

    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    // La API espera que el email esté codificado en la URL
    const encodedEmail = encodeURIComponent(email);

    return this.http.get<EmailVerificationResponse>(`${this.apiUrl}${encodedEmail}`, { headers }).pipe(
      catchError(error => {
        console.error('Error en la verificación de email:', error);
        // En caso de error en la API, retornamos null para no bloquear el formulario
        return of(null); 
      })
    );
  }
}
