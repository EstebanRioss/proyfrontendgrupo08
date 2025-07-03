import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Evento } from '../models/evento';
import { EventosService } from '../service/eventos.service';

@Component({
  selector: 'app-lista-eventos',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.css'
})
export class ListaEventosComponent {

    Eventos : Array<Evento>;
    constructor(private service  : EventosService , private router : Router){
      this.Eventos = new Array<Evento>();
      this.getEvento();
    }

    getEvento(){
    this.service.getEventos().subscribe(
      result => {
        console.log(result);
        let vevento: Evento = new Evento();
        result.forEach((element: any) => {
          Object.assign(vevento, element);
          this.Eventos.push(vevento);
          vevento = new Evento();
        });
       }
      );
    }

    Modificar(evento : Evento){
      this.router.navigate(['evento', evento._id])
    }
    
    Eliminar(evento : Evento){
      this.router.navigate(['evento', evento._id])
    }

}
