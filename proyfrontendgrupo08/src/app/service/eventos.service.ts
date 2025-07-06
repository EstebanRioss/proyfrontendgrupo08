import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  
  constructor(private _http: HttpClient) { }
  
  public getEventos():Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/eventos", httpOpttions);
  }

  public getEventosPorOrganizador(id : string):Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/eventos/organizador/" + id, httpOpttions);
  }

  public getNuevosEventos():Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/eventos/nuevos", httpOpttions);
  }
  public getProximosEventos():Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/eventos/proximos", httpOpttions);
  }
  
  public getEvento(id : string):Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/eventos/" + id, httpOpttions);
  }

  public createEvento(evento : any, token : string):Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({
          'Authorization': `Bearer ${token ? token : ''}`,
          'Content-Type': 'application/json',
        }),
        params: new HttpParams()
      }
      return this._http.post("http://localhost:3000/api/eventos/",evento,httpOpttions);
  }
  public updateEvento(id : string,evento : any, token : string):Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({
          'Authorization': `Bearer ${token ? token : ''}`,
          'Content-Type': 'application/json',
        }),
        params: new HttpParams()
      }
      return this._http.put("http://localhost:3000/api/eventos/" + id,evento,httpOpttions);
  }

  public deleteEvento(id: string, token: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token ? token : ''}`,
        'Content-Type': 'application/json',
      }),
      params: new HttpParams()
    };
    // Usamos PATCH para desactivar (puede ser DELETE si querés)
    return this._http.patch("http://localhost:3000/api/eventos/" + id +"/desactivar", httpOptions);
  }

  public activarEvento(id: string, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
    return this._http.patch("http://localhost:3000/api/eventos/" + id +"/activar", httpOptions);
  }

}
