import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http  : HttpClient) { }

  public getUsuarios(token : string | null ): Observable<any>{
    let httpOpttions = {
        headers : new HttpHeaders({
          'Authorization': `Bearer ${token ? token : ''}`
        }),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/usuarios/" , httpOpttions);
  }

}
