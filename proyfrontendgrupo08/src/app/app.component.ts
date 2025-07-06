import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FooterComponent,NavbarComponent, RouterModule,RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyfrontendgrupo08';
  constructor(public router: Router) {}

  get aplicarPadding(): boolean {
    const ruta = this.router.url;
    return !['/', '/inicio', '/eventos'].includes(ruta); // rutas que NO llevan padding
  }
}
