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

  constructor(private serviceE : EventosService, private serviceC : CategoriaService , private router : Router,private activatedRoute : ActivatedRoute,private auth : AuthService){

  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.cargarCategorias();

    if (this.id) {
      this.cargarEvento(this.id);
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
