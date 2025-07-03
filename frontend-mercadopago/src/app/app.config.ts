// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // Importa esto
import { FormsModule } from '@angular/forms'; // Importa esto

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Añade esto para peticiones HTTP
    importProvidersFrom(FormsModule) // Añade esto para usar ngModel en formularios
  ]
};