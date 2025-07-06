import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Usuario } from '../models/usuario';
import { CarritoService } from '../service/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  currentUser: Usuario | null = null;
  private userSubscription!: Subscription;
  carritoTotal: number = 0;
  menuAbierto: boolean = false;
  dropdownAbierto: boolean = false;
  navbarScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.navbarScrolled = window.scrollY > 20;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) {
      this.dropdownAbierto = false;
    }
  }
  toggleDropdown(): void {
    this.dropdownAbierto = !this.dropdownAbierto;
  }
  
  cerrarMenu(): void {
    this.menuAbierto = false;
    this.dropdownAbierto = false;
  } 

  constructor(
    private carritoService : CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onWindowScroll();
    this.carritoService.getCarritoObservable().subscribe(carrito => {
      this.carritoTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    });
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }

  gestion(): void {
    this.authService.logout();
    this.router.navigate(['/gestion']);
  }

}