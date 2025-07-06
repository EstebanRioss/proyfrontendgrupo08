import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Entrada } from '../models/entrada';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private baseUrl = 'https://pases-service.onrender.com/api/entradas';

  constructor(private _http: HttpClient) { }

  /**
   * Crea una nueva entrada (ticket) para un evento.
   * El token se añade automáticamente a través del AuthInterceptor.
   */
  public createEntrada(entradaData: { eventoId: string, cantidad: number }): Observable<Entrada> {
    return this._http.post<Entrada>(this.baseUrl, entradaData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todas las entradas de un usuario específico.
   * El token se añade automáticamente a través del AuthInterceptor.
   */
  public getEntradasPorUsuario(usuarioId: string | null): Observable<Entrada[]> {
    return this._http.get<Entrada[]>(`${this.baseUrl}/usuario/${usuarioId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todas las entradas del sistema (requiere rol de admin).
   * El token se añade automáticamente a través del AuthInterceptor.
   */
  public getEntradas(): Observable<Entrada[]> {
    return this._http.get<Entrada[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.error?.msg || 'Ocurrió un error con las entradas. Por favor, inténtalo de nuevo.';
    return throwError(() => new Error(errorMsg));
  }
}
