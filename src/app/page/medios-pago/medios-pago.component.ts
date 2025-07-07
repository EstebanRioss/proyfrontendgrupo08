import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-medios-pago',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medios-pago.component.html',
  styleUrls: ['./medios-pago.component.css']
})
export class MediosPagoComponent implements OnInit {
  
  metodosPago = [
    {
      categoria: 'Tarjetas de Crédito',
      icono: 'fas fa-credit-card',
      color: '#ae9ece',
      metodos: [
        { nombre: 'Visa', descripcion: 'Aceptamos todas las tarjetas Visa' },
        { nombre: 'Mastercard', descripcion: 'Todas las variantes de Mastercard' },
        { nombre: 'American Express', descripcion: 'Tarjetas American Express' },
        { nombre: 'Diners Club', descripcion: 'Tarjetas Diners Club' }
      ]
    },
    {
      categoria: 'Tarjetas de Débito',
      icono: 'fas fa-credit-card',
      color: '#4CAF50',
      metodos: [
        { nombre: 'Visa Débito', descripcion: 'Débito directo de tu cuenta' },
        { nombre: 'Mastercard Débito', descripcion: 'Débito inmediato' },
        { nombre: 'Maestro', descripcion: 'Tarjetas Maestro' }
      ]
    },
    {
      categoria: 'Transferencias Bancarias',
      icono: 'fas fa-university',
      color: '#2196F3',
      metodos: [
        { nombre: 'Transferencia Inmediata', descripcion: 'Pago instantáneo entre cuentas' },
        { nombre: 'Transferencia Bancaria', descripcion: 'Transferencia tradicional' }
      ]
    },
    {
      categoria: 'Billeteras Digitales',
      icono: 'fas fa-mobile-alt',
      color: '#FF9800',
      metodos: [
        { nombre: 'Mercado Pago', descripcion: 'Pago con Mercado Pago' },
        { nombre: 'Ualá', descripcion: 'Billetera digital Ualá' },
        { nombre: 'Naranja X', descripcion: 'Billetera Naranja X' }
      ]
    },
    {
      categoria: 'Efectivo',
      icono: 'fas fa-money-bill-wave',
      color: '#4CAF50',
      metodos: [
        { nombre: 'Puntos de Venta', descripcion: 'Pago en efectivo en nuestras sucursales' },
        { nombre: 'Pago Fácil', descripcion: 'Pago en efectivo en Pago Fácil' },
        { nombre: 'Rapipago', descripcion: 'Pago en efectivo en Rapipago' }
      ]
    }
  ];

  beneficios = [
    {
      titulo: 'Pago en Cuotas',
      descripcion: 'Hasta 12 cuotas sin interés con tarjetas seleccionadas',
      icono: 'fas fa-calendar-alt'
    },
    {
      titulo: 'Pago Seguro',
      descripcion: 'Todas las transacciones están protegidas con encriptación SSL',
      icono: 'fas fa-shield-alt'
    },
    {
      titulo: 'Confirmación Inmediata',
      descripcion: 'Recibe confirmación de tu pago al instante',
      icono: 'fas fa-check-circle'
    },
    {
      titulo: 'Soporte 24/7',
      descripcion: 'Asistencia disponible en cualquier momento',
      icono: 'fas fa-headset'
    }
  ];

  ngOnInit(): void {
    // Scroll al inicio de la página cuando se carga
    window.scrollTo(0, 0);
  }
} 