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

    Crear(){
      this.router.navigate(['evento/nuevo'])
    }
    
    Modificar(evento : Evento){
      this.router.navigate(['evento/editar', evento._id])
    }
    
    Eliminar(evento : Evento){
      this.router.navigate(['evento', evento._id])
    }

}
