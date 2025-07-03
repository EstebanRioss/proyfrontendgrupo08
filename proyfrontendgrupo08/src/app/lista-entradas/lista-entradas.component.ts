import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Entrada } from '../models/entrada';
import { EntradaService } from '../service/entrada.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-entradas',
  imports: [CommonModule],
  templateUrl: './lista-entradas.component.html',
  styleUrl: './lista-entradas.component.css'
})
export class ListaEntradasComponent {
  Entradas : Array<Entrada>;
    constructor(private service  : EntradaService , private router : Router){
      this.Entradas = new Array<Entrada>();
      this.getEntradas();
    }

    getEntradas(){
        this.service.getEntradas().subscribe(
          result => {
            console.log(result);
            let ve: Entrada = new Entrada();
            result.forEach((element: any) => {
              Object.assign(ve, element);
              this.Entradas.push(ve);
              ve = new Entrada();
            });
           }
          );
    }

    Modificar(e : Entrada){
              this.router.navigate(['evento', e._id])
    }
            
    Eliminar(e : Entrada){
              this.router.navigate(['evento', e._id])
    }
}
