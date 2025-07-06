import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

@Injectable({
  providedIn: 'root'
})
export class MpService {
  private baseUrl = 'http://localhost:3000/api/mp';

  constructor(private http: HttpClient) {}

  comprarEntradas(
    eventoId: string,
    usuarioId: string,
    tipoEntrada: string,
    cantidad: number,
    precioUnitario: number,
    eventName: string,
    eventDescription: string,
    imageUrl: string
  ): Observable<PreferenceResponse> {
    const body = {
      eventoId,
      usuarioId,
      tipoEntrada,
      cantidad,
      precioUnitario,
      eventName,
      eventDescription,
      imageUrl
    };
    return this.http.post<PreferenceResponse>(this.baseUrl + "/buy-ticket", body);
  }

  comprarMultiplesEntradas(
    eventoId: string,
    usuarioId: string,
    entradas: { tipoEntrada: string; cantidad: number; precioUnitario: number }[],
    eventName: string,
    eventDescription: string,
    imageUrl: string
  ): Observable<PreferenceResponse> {
    const body = {
      eventoId,
      usuarioId,
      entradas,
      eventName,
      eventDescription,
      imageUrl
    };
    return this.http.post<PreferenceResponse>(this.baseUrl + "/buy-cart", body);
  }

}
