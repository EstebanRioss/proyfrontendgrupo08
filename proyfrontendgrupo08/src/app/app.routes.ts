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
import { EventoComponent } from './evento/evento.component';
import { FormOrganizadorComponent } from './signup/form-organizador/form-organizador.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { EditarUsuariosComponent } from './lista-usuarios/editar-usuarios/editar-usuarios.component';
export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: PagesComponent },
    { path: 'eventos', component: EventosComponent },
    { path: 'evento/ver/:id', component: EventoComponent },        // antes: evento/:id

    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'confirmar-email/:token', component: ConfirmacionEmailComponent },

    { path: 'micuenta', component: MiCuentaComponent },
    { path: 'admin/usuarios', component: ListaUsuariosComponent },
    { path: 'admin/usuarios/editar/:id', component: EditarUsuariosComponent }, 
    { path: 'gestion', component: GestionComponent },

    // Formularios de Evento
    { path: 'evento/nuevo', component: FormEventoComponent },       // antes: evento/crear
    { path: 'evento/editar/:id', component: FormEventoComponent },  // sin cambios pero mejor ubicado

    // Formularios de Categoría
    { path: 'categoria/nueva', component: FormCategoriaComponent },      // antes: categoria/crear
    { path: 'categoria/editar/:id', component: FormCategoriaComponent },
    {path:'form-organizador', component:FormOrganizadorComponent}

];
