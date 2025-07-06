import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Evento } from '../models/evento';
import { EventosService } from '../service/eventos.service';
import { Usuario } from '../models/usuario';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-lista-eventos',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.css'
})
export class ListaEventosComponent  implements OnInit, OnDestroy{
    currentUser: Usuario | null = null;
    private userSubscription!: Subscription;
    Eventos : Array<Evento>;
    constructor(private service  : EventosService , private router : Router,private authService: AuthService){
      this.Eventos = new Array<Evento>();
      this.getEvento();
    }

    ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    }

    ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    }

    getEvento() {
      this.Eventos = [];

      this.service.getEventos().subscribe(result => {
        // Si es organizador, filtramos por su ID
        let eventosFiltrados = result;

        if (this.currentUser?.rol === "organizador") {
          eventosFiltrados = result.filter((evento: any) =>
            evento.organizadorId === this.currentUser?._id
          );
        }

        eventosFiltrados.forEach((element: any) => {
          const vevento = new Evento();
          Object.assign(vevento, element);
          this.Eventos.push(vevento);
        });
      });
    }

    getNombreOrganizador(evento: Evento): string {
      if (typeof evento.organizadorId === 'string') return evento.organizadorId;
      return evento.organizadorId?.nombre || 'Sin nombre';
    }

    getNombreCategoria(evento: Evento): string {
      if (typeof evento.categoriaId === 'string') return evento.categoriaId;
      return evento.categoriaId?.nombre || 'Sin categoría';
    }

    Crear(){
      this.router.navigate(['evento/nuevo'])
    }
    
    Modificar(evento : Evento){
      this.router.navigate(['evento/editar', evento._id])
    }
    
    Eliminar(evento: Evento) {
      const action = evento.estado ? 'desactivar' : 'activar';
      const confirmMsg = evento.estado
        ? `¿Querés desactivar el evento "${evento.nombre}"?`
        : `¿Querés activar el evento "${evento.nombre}"?`;

      if (!confirm(confirmMsg)) return;

      const token = this.authService.getToken();

      if (evento.estado) {
        this.service.deleteEvento(evento._id!, token!).subscribe({
          next: (res) => {
            alert(res.msg);
            this.getEvento();
          },
          error: (err) => alert('Error: ' + (err.error.msg || err.message)),
        });
      } else {
        this.service.activarEvento(evento._id!, token!).subscribe({
          next: (res) => {
            alert(res.msg);
            this.getEvento();
          },
          error: (err) => alert('Error: ' + (err.error.msg || err.message)),
        });
      }
    }

}
