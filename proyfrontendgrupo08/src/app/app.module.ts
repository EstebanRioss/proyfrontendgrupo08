import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideRouter, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PagesComponent } from './page/page.component';
import { routes } from './app.routes';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      [
        { path: 'inicio', component: PagesComponent },
        { path: '', redirectTo: 'inicio', pathMatch: 'full' }
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }