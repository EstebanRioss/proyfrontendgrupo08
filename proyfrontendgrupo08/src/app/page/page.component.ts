import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PageService } from '../service/page.service';
import { Evento } from '../models/evento';

@Component({
  selector: 'app-pages',
  imports: [CommonModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PagesComponent{
  EventosNuevos : Array<Evento>;
  EventosProximos : Array<Evento>;
  constructor(private service  : PageService){
    this.EventosNuevos = new  Array<Evento>();
    this.EventosProximos = new Array<Evento>();
    this.getEventosNuevos();
    this.getEventosProximos();
  }

  getEventosNuevos() {
  this.service.getNuevosEventos().subscribe(
    result => {
      console.log(result);
      let vevento: Evento = new Evento();
      result.forEach((element: any) => {
        Object.assign(vevento, element);
        this.EventosNuevos.push(vevento);
        vevento = new Evento();
      });
    }
  );
}

getEventosProximos() {
  this.service.getProximosEventos().subscribe(
    result => {
      console.log(result);
      let vevento: Evento = new Evento();
      result.forEach((element: any) => {
        Object.assign(vevento, element);
        this.EventosProximos.push(vevento);
        vevento = new Evento();
      });
    }
  );
}
}
