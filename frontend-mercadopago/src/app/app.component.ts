import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from './services/payment.service';

// Declaramos la variable global de MercadoPago
declare var MercadoPago: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Quitamos RouterOutlet que no se usa
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { // Implementa OnInit

  private mp: any; // Solo declaramos la propiedad aquí
  isProcessing = false;

  orderData = {
    event_name: 'Concierto de Rock',
    ticket_price: 5000,
    quantity: 1
  };

  constructor(private paymentService: PaymentService) {}

  // ngOnInit se ejecuta después de que el componente se carga
  ngOnInit(): void {
    // Inicializamos MercadoPago aquí, de forma segura
    // ¡¡IMPORTANTE!! Reemplaza con tu Public Key
    this.mp = new MercadoPago('APP_USR-f24a6b9c-b19c-4378-9b8f-4595f209b94d', { locale: 'es-AR' });
  }

  onSubmit(): void {
    this.isProcessing = true;

    this.paymentService.createPreference(this.orderData).subscribe({
      next: (preference) => {
        this.createCheckoutButton(preference.id);
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al generar el link de pago.');
        this.isProcessing = false;
      }
    });
  }

  createCheckoutButton(preferenceId: string): void {
    const container = document.getElementById('wallet_container');
    if (container) {
      container.innerHTML = '';
    }

    this.mp.bricks().create("wallet", "wallet_container", {
      initialization: {
        preferenceId: preferenceId,
      },
      customization: {
        texts: {
          valueProp: 'smart_option',
        },
      },
    });

    const submitButton = document.querySelector('.submit-btn');
    if (submitButton) {
      (submitButton as HTMLElement).style.display = 'none';
    }
  }
}