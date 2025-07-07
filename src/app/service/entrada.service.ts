import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  constructor(private _http : HttpClient) { }

  public getEntradas():Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/entradas", httpOpttions);
  }
}
