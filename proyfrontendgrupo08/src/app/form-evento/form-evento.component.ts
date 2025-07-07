import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evento } from '../models/evento';
import { EventosService } from '../service/eventos.service';
import { CategoriaService } from '../service/categoria.service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-form-evento',
  imports: [CommonModule,FormsModule],
  templateUrl: './form-evento.component.html',
  styleUrl: './form-evento.component.css'
})
export class FormEventoComponent implements OnInit {
  evento: Evento = {} as Evento;
  categorias: any[] = [];
  id : string = "";
  sumaEntradas: number = 0;
  capacidadValida: boolean = true;

  constructor(private serviceE : EventosService, private serviceC : CategoriaService , private router : Router,private activatedRoute : ActivatedRoute,private auth : AuthService){

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.evento.entradas = [];
    this.cargarCategorias();

    if (this.id) {
      this.cargarEvento(this.id);
    }
  }

  agregarEntrada(): void {
    if (!this.evento.entradas) this.evento.entradas = [];
    this.evento.entradas.push({ tipo: '', precio: 0, cantidad: 0 });
    this.recalcularSuma();
  }

  eliminarEntrada(index: number): void {
    this.evento.entradas.splice(index, 1);
    this.recalcularSuma();
  }

  recalcularSuma(): void {
    this.sumaEntradas = this.evento.entradas.reduce((acc, e) => acc + Number(e.cantidad || 0), 0);
    this.capacidadValida = this.sumaEntradas === Number(this.evento.capacidadTotal || 0);
  }

  checkAutoAgregar(index: number) {
    const entrada = this.evento.entradas[index];
    const esUltima = index === this.evento.entradas.length - 1;
    
    const completa = entrada.tipo && entrada.precio && entrada.cantidad;
    
    if (esUltima && completa) {
      // Solo si es la última y está completa, se agrega una nueva vacía
      this.agregarEntrada();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Esto guarda la imagen como base64 en imagenUrl
        this.evento.imagenUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  cargarEvento(id: string): void {
    this.serviceE.getEvento(id).subscribe({
      next: (evento) => {
        this.evento = evento;
        if (!this.evento.entradas) this.evento.entradas = [];
        this.recalcularSuma();
      },
      error: (err) => {
        console.error('Error cargando evento:', err);
      }
    });
  }

  cargarCategorias(): void {
    this.serviceC.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  guardarEvento(): void {
    const token = this.auth.getToken();
    this.evento.estado = true;

    this.recalcularSuma();
    if (!this.capacidadValida) {
      alert('⚠️ La capacidad total no coincide con la suma de las entradas.');
      return;
    }

    if (this.id) {
      // Modo edición
      this.serviceE.updateEvento(this.id, this.evento, token!).subscribe({
        next: () => {
          alert('✅ Evento actualizado correctamente');
          this.router.navigate(['/gestion']);
        },
        error: (err) => {
          console.error('Error al actualizar el evento:', err);
          alert('❌ Error al actualizar el evento');
        }
      });
    } else {
      // Modo creación
      this.serviceE.createEvento(this.evento, token!).subscribe({
        next: () => {
          alert('✅ Evento creado correctamente');
          this.router.navigate(['/gestion']);
        },
        error: (err) => {
          console.error('Error al guardar el evento:', err);
          alert('❌ Error al crear el evento');
        }
      });
    }
  }

}
