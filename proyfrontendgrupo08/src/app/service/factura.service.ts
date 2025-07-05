import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Factura } from '../models/factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private baseUrl = 'http://localhost:3000/api/facturas';

  constructor(private _http: HttpClient) { }

  /**
   * Obtiene las facturas de un usuario específico.
   * El token se añade automáticamente a través del AuthInterceptor.
   */
  public getFacturasPorUsuario(idUsuario: string): Observable<Factura[]> {
    return this._http.get<Factura[]>(`${this.baseUrl}/usuario/${idUsuario}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva factura.
   * El token se añade automáticamente a través del AuthInterceptor.
   */
  public createFactura(factura: Partial<Factura>): Observable<Factura> {
    return this._http.post<Factura>(this.baseUrl, factura).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.error?.msg || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
    return throwError(() => new Error(errorMsg));
  }
}
