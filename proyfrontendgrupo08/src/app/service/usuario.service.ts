import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://pases-service.onrender.com/api/usuarios';

  constructor(private _http: HttpClient, private authService: AuthService) { }

  /**
   * Crea las cabeceras de autenticación para las peticiones.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  /**
   * Obtiene todos los usuarios del backend.
   */
  public getUsuarios(): Observable<Usuario[]> {
    const httpOptions = { headers: this.getAuthHeaders() };
    return this._http.get<Usuario[]>(this.apiUrl, httpOptions);
  }

  /**
   * Obtiene un único usuario por su ID.
   * @param id El ID del usuario.
   */
  public getUsuario(id: string): Observable<Usuario> {
    const httpOptions = { headers: this.getAuthHeaders() };
    return this._http.get<Usuario>(`${this.apiUrl}/${id}`, httpOptions);
  }

  /**
   * Llama al endpoint para confirmar un usuario mediante un token.
   * @param token El token de confirmación.
   */
  public confirmarUsuario(token: string | null): Observable<any> {
    return this._http.get(`${this.apiUrl}/confirmar/${token}`);
  }
  /**
   * --- NUEVO MÉTODO ---
   * Actualiza los datos de un usuario existente.
   * @param id El ID del usuario a actualizar.
   * @param userData Los datos parciales del usuario a modificar.
   */
  public updateUsuario(id: string, userData: Partial<Usuario>): Observable<any> {
    const httpOptions = { headers: this.getAuthHeaders() };
    return this._http.put(`${this.apiUrl}/${id}`, userData, httpOptions);
  }

  /**
   * Desactiva un usuario enviando una petición DELETE.
   * @param id El ID del usuario a desactivar.
   */
  public deleteUsuario(id: string): Observable<any> {
    const httpOptions = { headers: this.getAuthHeaders() };
    return this._http.delete(`${this.apiUrl}/${id}`, httpOptions);
  }
}
