import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl = 'https://pases-service.onrender.com/api/categoria';

  constructor(private _http: HttpClient) { }

  public getCategorias(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: new HttpParams()
    };
    return this._http.get(this.baseUrl, httpOptions);
  }

  public getCategoria(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: new HttpParams()
    };
    return this._http.get(`${this.baseUrl}/${id}`, httpOptions); // corregido
  }

  public createCategoria(categoria: any, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json',
      }),
      params: new HttpParams()
    };
    return this._http.post(this.baseUrl, categoria, httpOptions);
  }

  public updateCategoria(id: string, categoria: any, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json',
      }),
      params: new HttpParams()
    };
    return this._http.put(`${this.baseUrl}/${id}`, categoria, httpOptions);
  }

  public deleteCategoria(id: string, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json',
      }),
      params: new HttpParams()
    };
    return this._http.delete(`${this.baseUrl}/${id}`, httpOptions);
  }
}
