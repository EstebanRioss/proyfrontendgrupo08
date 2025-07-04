import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private  _http : HttpClient) { }
    public getCategorias():Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/categoria", httpOpttions);
    }

    public getCategoria(id : string):Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({}),
        params: new HttpParams()
      }
      return this._http.get("http://localhost:3000/api/categoria" + id, httpOpttions);
    }

    public createCategoria(categoria : any, token : string):Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({
          'Authorization': `Bearer ${token ? token : ''}`,
          'Content-Type': 'application/json',
        }),
        params: new HttpParams()
      }
      return this._http.post("http://localhost:3000/api/categoria/",categoria,httpOpttions);
    }

    public updateCategoria(id :string , categoria : any, token : string):Observable<any>{
      let httpOpttions = {
        headers : new HttpHeaders({
          'Authorization': `Bearer ${token ? token : ''}`,
          'Content-Type': 'application/json',
        }),
        params: new HttpParams()
      }
      return this._http.put("http://localhost:3000/api/categoria/"+ id,categoria,httpOpttions);
    }
}
