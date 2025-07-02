import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private _http: HttpClient) { }
  
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
}
