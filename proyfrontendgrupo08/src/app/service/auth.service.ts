import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

export interface AuthResponse {
    status: string;
    msg: string;
    token: string;
    userId: string;
    email: string;
    rol: string;
}

export interface ConfirmationResponse {
  msg: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://pases-service.onrender.com/api/usuarios';
    private currentUserSubject: BehaviorSubject<Usuario | null>;
    public currentUser: Observable<Usuario | null>;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        const storedUser = this.getUserFromSession();
        this.currentUserSubject = new BehaviorSubject<Usuario | null>(storedUser);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario | null {
        return this.currentUserSubject.value;
    }

    register(userData: Partial<Usuario>): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/`, userData).pipe(
            catchError((error: HttpErrorResponse) => {
                const errorMsg = error.error?.msg || 'Error en el registro. Inténtalo de nuevo.';
                return throwError(() => new Error(errorMsg));
            })
        );
    }

    login(credentials: { email: string, contraseña: string }): Observable<Usuario> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            switchMap(response => {
                if (response && response.status === '1') {
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.setItem('token', response.token);
                    }
                    return this.fetchAndStoreUser(response.userId);
                } else {
                    return throwError(() => new Error(response.msg || 'Credenciales inválidas'));
                }
            })
        );
    }

    googleLogin(googleUserData: any): Observable<Usuario> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/google-signin`, googleUserData).pipe(
            switchMap(response => {
                if (response && response.status === '1') {
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.setItem('token', response.token);
                    }
                    return this.fetchAndStoreUser(response.userId);
                } else {
                    return throwError(() => new Error(response.msg || 'Error en el inicio de sesión con Google.'));
                }
            }),
            catchError((error: HttpErrorResponse) => {
                const errorMsg = error.error?.msg || 'Error en el inicio de sesión con Google.';
                return throwError(() => new Error(errorMsg));
            })
        );
    }
    
    confirmarEmail(token: string): Observable<ConfirmationResponse> {
      return this.http.get<ConfirmationResponse>(`${this.apiUrl}/confirmar/${token}`).pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMsg = error.error?.msg || 'Error al confirmar la cuenta.';
          return throwError(() => new Error(errorMsg));
        })
      );
    }
  
    aprobarRol(usuarioId: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/aprobar-rol/${usuarioId}`, {});
    }

    private fetchAndStoreUser(userId: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${userId}`).pipe(
            tap(user => {
                if (isPlatformBrowser(this.platformId)) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
                this.currentUserSubject.next(user);
            })
        );
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.clear();
        }
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return sessionStorage.getItem('token');
        }
        return null;
    }
    
    getUserRole(): string | null {
        return this.currentUserValue?.rol || null;
    }

    private getUserFromSession(): Usuario | null {
        if (isPlatformBrowser(this.platformId)) {
            const userJson = sessionStorage.getItem('currentUser');
            return userJson ? JSON.parse(userJson) : null;
        }
        return null;
    }
    updateUsuario(userId: string, userData: Partial<Usuario>): Observable<{ msg: string, usuario: Usuario }> {
        return this.http.put<{ msg: string, usuario: Usuario }>(`${this.apiUrl}/${userId}`, userData).pipe(
        tap(response => {
            const currentUser = this.currentUserSubject.value;
            if (currentUser && currentUser._id === userId) {
            const updatedUser = { ...currentUser, ...response.usuario };
            
            if (isPlatformBrowser(this.platformId)) {
                sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
            
            this.currentUserSubject.next(updatedUser);
            }
        }),
        catchError((error: HttpErrorResponse) => {
            const errorMsg = error.error?.msg || 'Error al actualizar el usuario.';
            return throwError(() => new Error(errorMsg));
        })
        );
    }
    cambiarContrasena(userId: string, datosContrasena: any): Observable<{ msg: string }> {
        return this.http.put<{ msg: string }>(`${this.apiUrl}/cambiar-contrasena/${userId}`, datosContrasena).pipe(
        catchError((error: HttpErrorResponse) => {
            const errorMsg = error.error?.msg || 'Error al cambiar la contraseña.';
            return throwError(() => new Error(errorMsg));
        })
        );
    }
    getId(): string | null {
        return this.currentUserValue?._id || null;
    }
}