import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Entrada } from '../models/entrada';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {
    private baseUrl = 'https://pases-service.onrender.com/api/entradas';

constructor(private _http: HttpClient, private authService: AuthService) {}

/**
 * Crea una nueva entrada (ticket) para un evento.
 * Requiere que el usuario esté autenticado.
 */
public createEntrada(entradaData: { eventoId: string, cantidad: number }): Observable<Entrada> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this._http.post<Entrada>(this.baseUrl, entradaData, { headers }).pipe(
    catchError(this.handleError)
  );
}

  /**
   * Obtiene las entradas del usuario autenticado (usa /mis-entradas).
   */
  public getMisEntradas(): Observable<Entrada[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._http.get<Entrada[]>(`${this.baseUrl}/mis-entradas`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todas las entradas del sistema (solo administradores).
   */
  public getEntradas(): Observable<Entrada[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._http.get<Entrada[]>(this.baseUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una entrada por su ID.
   */
  public getEntradaById(id: string): Observable<Entrada> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._http.get<Entrada>(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una entrada (solo para administradores).
   */
  public updateEntrada(id: string, data: Partial<Entrada>): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._http.put(`${this.baseUrl}/${id}`, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una entrada por su ID (solo para administradores).
   */
  public deleteEntrada(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._http.delete(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.error?.msg || 'Ocurrió un error con las entradas. Por favor, inténtalo de nuevo.';
    return throwError(() => new Error(errorMsg));
  }

}
