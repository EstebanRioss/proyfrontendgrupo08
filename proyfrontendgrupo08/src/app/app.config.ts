import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // --- AÑADE ESTAS LÍNEAS ---
    provideHttpClient(withInterceptorsFromDi()), // Habilita los interceptores
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    // -------------------------
  ]
};