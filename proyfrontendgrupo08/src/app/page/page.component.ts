import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PageService } from '../service/page.service';
import { Evento } from '../models/evento';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  imports: [CommonModule,RouterModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PagesComponent{
  EventosNuevos : Array<Evento>;
  EventosProximos : Array<Evento>;
  constructor(private service  : PageService,private router : Router){
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

detalles(evento : Evento){
      this.router.navigate(['evento', evento._id])
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
