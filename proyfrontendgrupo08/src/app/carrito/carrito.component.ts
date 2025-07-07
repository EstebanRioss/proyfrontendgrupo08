import { Component, OnInit } from '@angular/core';
import { CarritoService, EntradaCarrito } from '../service/carrito.service';
import { MpService } from '../service/mp.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule,RouterModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  carrito: EntradaCarrito[] = [];
  total: number = 0;

  constructor(
    private carritoService : CarritoService,
    private mpService : MpService,
    private router : Router,
    private authservice : AuthService
  ){}
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.carritoService.getCarritoObservable().subscribe(items => {
      this.carrito = items;
      this.calcularTotal();
    });
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  eliminarItem(index: number) {
    this.carrito.splice(index, 1);
    this.carritoService.limpiarCarrito();
    this.carritoService.getCarritoObservable().subscribe(items => {
      // Actualizamos el carrito en el servicio después de eliminar
      for (const item of this.carrito) {
        this.carritoService.agregarAlCarrito(item);
      }
    });
    this.calcularTotal();
  }
  pagarCarrito() {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const usuarioId = this.authservice.currentUserValue?._id; // Aquí debés poner el usuario actual logueado (p.ej. desde AuthService)
    const eventoId = this.carrito[0].eventoId; // Podrías modificar para soportar múltiples eventos

    // Armamos el arreglo de entradas para el backend
    const entradasParaPago = this.carrito.map(item => ({
      tipoEntrada: item.tipoEntrada,
      cantidad: item.cantidad,
      precioUnitario: item.precio
    }));

    this.mpService.comprarMultiplesEntradas(
      eventoId,
      usuarioId!,
      entradasParaPago,
      this.carrito[0].nombreEvento,
      '',
      ''
    ).subscribe({
      next: resp => {
        window.location.href = resp.initPoint;
      },
      error: () => {
        alert('Error al iniciar la compra.');
      }
    });
  }
}
