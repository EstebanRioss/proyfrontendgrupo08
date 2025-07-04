import { Routes } from '@angular/router';
import { PagesComponent } from './page/page.component';
import { EventosComponent } from './eventos/eventos.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmacionEmailComponent } from './page/confirmacion-email/confirmacion-email.component';
import { GestionComponent } from './gestion/gestion.component';
import { MiCuentaComponent } from './page/mi-cuenta/mi-cuenta.component';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { FormCategoriaComponent } from './form-categoria/form-categoria.component';
export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: PagesComponent},
    { path: 'eventos', component: EventosComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'confirmar-email/:token', component: ConfirmacionEmailComponent},
    { path: 'gestion', component: GestionComponent},
    { path:'micuenta', component: MiCuentaComponent},
    { path: 'evento/crear', component: FormEventoComponent},
    { path: 'evento/editar/:id', component: FormEventoComponent},
    { path: 'categoria/crear', component: FormCategoriaComponent},
    { path: 'categoria/editar/:id', component: FormCategoriaComponent},


];
