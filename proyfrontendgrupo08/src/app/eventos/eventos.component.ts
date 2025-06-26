import { Component } from '@angular/core';
import { CategoriaEvento } from '../models/categoria-evento';
import { Evento } from '../models/evento';
import { EventosService } from '../service/eventos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eventos',
  imports: [CommonModule,FormsModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent {
    Categorias : Array<CategoriaEvento>;
    Eventos : Array<Evento>;
    categoriaSeleccionada: string = 'all';
    
    constructor(private service  : EventosService){
      this.Categorias = new  Array<CategoriaEvento>();
      this.Eventos = new Array<Evento>();
      this.getCategorias();
      this.getEvento();
    }
  
    getCategorias() {
    this.service.getCategorias().subscribe(
      result => {
        console.log(result);
        let vcate: CategoriaEvento = new CategoriaEvento();
        result.forEach((element: any) => {
          Object.assign(vcate, element);
          this.Categorias.push(vcate);
          vcate = new CategoriaEvento();
        });
       }
      );
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

    EventosFiltrados(): Evento[] {
      if (this.categoriaSeleccionada === 'all') return this.Eventos;
      return this.Eventos.filter(ev => ev.categoriaId === this.categoriaSeleccionada);
    }

}
