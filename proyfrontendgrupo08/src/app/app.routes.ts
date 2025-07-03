import { Routes } from '@angular/router';
import { PagesComponent } from './page/page.component';
import { EventosComponent } from './eventos/eventos.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { ConfirmacionEmailComponent } from './page/confirmacion-email/confirmacion-email.component';
import { GestionComponent } from './gestion/gestion.component';
export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: PagesComponent},
    { path: 'eventos', component: EventosComponent},
    // ¡Añade esta línea!
    { path: 'login', component: LoginComponent},
    { path: 'signin', component: SigninComponent},
    { path: 'confirmar-email/:token', component: ConfirmacionEmailComponent},
    { path: 'gestion', component: GestionComponent}

];