import { Routes } from '@angular/router';
import { PagesComponent } from './page/page.component';
import { EventosComponent } from './eventos/eventos.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: PagesComponent },
    { path: 'eventos', component: EventosComponent },
    // ¡Añade esta línea!
    { path: 'login', component: LoginComponent } 
];