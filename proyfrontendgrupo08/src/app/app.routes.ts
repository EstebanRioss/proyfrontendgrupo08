import { Routes } from '@angular/router';
import { PagesComponent } from './page/page.component';
import { EventosComponent } from './eventos/eventos.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    {path: 'inicio', component: PagesComponent},
    {path: 'eventos', component: EventosComponent},
];