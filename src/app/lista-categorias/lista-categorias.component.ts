import { Component } from '@angular/core';
import { CategoriaEvento } from '../models/categoria-evento';
import { CategoriaService } from '../service/categoria.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-categorias',
  imports: [CommonModule],
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.css'
})
export class ListaCategoriasComponent {
    Categorias : Array<CategoriaEvento>;
    constructor(private serviceC  : CategoriaService , private router : Router){
      this.Categorias = new Array<CategoriaEvento>();
      this.getCategorias();
    }

    getCategorias(){
    this.serviceC.getCategorias().subscribe(
      result => {
        console.log(result);
        let vc: CategoriaEvento = new CategoriaEvento();
        result.forEach((element: any) => {
          Object.assign(vc, element);
          this.Categorias.push(vc);
          vc = new CategoriaEvento();
        });
       }
      );
    }

    Crear (){
      this.router.navigate(['categoria/crear'])
    }

    Modificar(c : CategoriaEvento){
      this.router.navigate(['categoria/editar', c._id])
    }
    
    Eliminar(c : CategoriaEvento){
      this.router.navigate(['evento', c._id])
    }
}
