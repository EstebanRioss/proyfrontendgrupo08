import { Routes } from '@angular/router';
import { PagesComponent } from './page/page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    {path: 'inicio', component: PagesComponent},
];