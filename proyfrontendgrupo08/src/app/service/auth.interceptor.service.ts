// src/app/service/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el AuthService usando la función inject()
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Si hay token, clonamos la petición para añadir el encabezado
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedRequest);
  }

  // Si no hay token, la petición sigue su curso sin modificaciones
  return next(req);
};