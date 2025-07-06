import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface EntradaCarrito {
  tipoEntrada: string;
  precio: number;
  cantidad: number;
  eventoId: string;
  nombreEvento: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  private carrito: EntradaCarrito[] = [];
  private carrito$ = new BehaviorSubject<EntradaCarrito[]>([]);

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.cargarCarritoLocalStorage();
    }
  }

  private guardarCarritoLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  private cargarCarritoLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        this.carrito = JSON.parse(carritoGuardado);
        this.carrito$.next([...this.carrito]);
      }
    }
  }

  getCarritoObservable() {
    return this.carrito$.asObservable();
  }

  agregarAlCarrito(entrada: EntradaCarrito) {
    const index = this.carrito.findIndex(e =>
      e.tipoEntrada === entrada.tipoEntrada && e.eventoId === entrada.eventoId
    );

    if (index > -1) {
      this.carrito[index].cantidad += entrada.cantidad;
    } else {
      this.carrito.push(entrada);
    }

    this.carrito$.next([...this.carrito]);
    this.guardarCarritoLocalStorage();
  }

  obtenerCarritoActual() {
    return [...this.carrito];
  }

  limpiarCarrito() {
    this.carrito = [];
    this.carrito$.next([]);
    localStorage.removeItem('carrito');
  }
}
