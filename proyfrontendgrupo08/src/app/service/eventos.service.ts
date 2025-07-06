import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  
  private baseUrl = 'https://pases-service.onrender.com/api/eventos';

  constructor(private _http: HttpClient) { }

  private getHttpOptions(token?: string): { headers: HttpHeaders, params: HttpParams } {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return {
      headers,
      params: new HttpParams()
    };
  }

  // ----- GET -----

  getEventos(): Observable<any> {
    return this._http.get(`${this.baseUrl}`, this.getHttpOptions());
  }

  getEventosPorOrganizador(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/organizador/${id}`, this.getHttpOptions());
  }

  getNuevosEventos(): Observable<any> {
    return this._http.get(`${this.baseUrl}/nuevos`, this.getHttpOptions());
  }

  getProximosEventos(): Observable<any> {
    return this._http.get(`${this.baseUrl}/proximos`, this.getHttpOptions());
  }

  getEvento(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`, this.getHttpOptions());
  }

  // ----- POST -----

  createEvento(evento: any, token: string): Observable<any> {
    return this._http.post(`${this.baseUrl}`, evento, this.getHttpOptions(token));
  }

  // ----- PUT -----

  updateEvento(id: string, evento: any, token: string): Observable<any> {
    return this._http.put(`${this.baseUrl}/${id}`, evento, this.getHttpOptions(token));
  }

  // ----- PATCH -----

  deleteEvento(id: string, token: string): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}/desactivar`, {}, this.getHttpOptions(token));
  }

  activarEvento(id: string, token: string): Observable<any> {
    return this._http.patch(`${this.baseUrl}/${id}/activar`, {}, this.getHttpOptions(token));
  }

}
