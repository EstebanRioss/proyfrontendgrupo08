import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-medios-pago',
  imports: [CommonModule,RouterModule],
  templateUrl: './medios-pago.component.html',
  styleUrl: './medios-pago.component.css'
})
export class MediosPagoComponent {
  constructor(){
    window.scrollTo(0, 0);
  }
  metodosPago = [
    {
      categoria: 'Tarjetas de Crédito',
      color: '#7a52b0',
      icono: 'fas fa-credit-card',
      metodos: [
        { nombre: 'Visa', descripcion: 'Aceptamos todas las tarjetas Visa nacionales e internacionales.' },
        { nombre: 'MasterCard', descripcion: 'Pagá con tu MasterCard de manera rápida y segura.' },
        { nombre: 'American Express', descripcion: 'Opciones especiales de financiación con Amex.' }
      ]
    },
    {
      categoria: 'Transferencias Bancarias',
      color: '#5a3ebc',
      icono: 'fas fa-university',
      metodos: [
        { nombre: 'CBU / Alias', descripcion: 'Transferencias directas desde tu home banking.' },
        { nombre: 'MercadoPago', descripcion: 'Podés pagar desde tu cuenta de MercadoPago con saldo o débito.' }
      ]
    },
  ];

  beneficios = [
    {
      icono: 'fas fa-wallet',
      titulo: 'Flexibilidad de Pago',
      descripcion: 'Elegí el método de pago que más se adapte a tus necesidades.'
    },
    {
      icono: 'fas fa-clock',
      titulo: 'Procesamiento Rápido',
      descripcion: 'Las transacciones se confirman en pocos minutos.'
    },
    {
      icono: 'fas fa-thumbs-up',
      titulo: 'Comodidad Total',
      descripcion: 'Pagá desde tu celular, computadora o presencialmente.'
    }
  ];

}
