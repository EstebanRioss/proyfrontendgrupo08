// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './service/auth.interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // ✅ Esta es la única línea que necesitas para el interceptor.
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};