import { Component } from '@angular/core';
import { CategoriaEvento } from '../models/categoria-evento';
import { CategoriaService } from '../service/categoria.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-lista-categorias',
  imports: [CommonModule],
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.css'
})
export class ListaCategoriasComponent {
    Categorias: Array<CategoriaEvento> = [];

    constructor(private serviceC: CategoriaService, private router: Router, private auth : AuthService) {
      this.getCategorias();
    }

    getCategorias() {
      this.Categorias = [];

      this.serviceC.getCategorias().subscribe(result => {
        result.forEach((element: any) => {
          const vc = new CategoriaEvento();
          Object.assign(vc, element);
          this.Categorias.push(vc);
        });
      });
    }

    Crear() {
      this.router.navigate(['categoria/nueva']);
    }

    Modificar(c: CategoriaEvento) {
      this.router.navigate(['categoria/editar', c._id]);
    }

    Eliminar(c: CategoriaEvento) {
      const confirmMsg = `¿Querés eliminar la categoría "${c.nombre}"?`;

      if (!confirm(confirmMsg)) return;

      this.serviceC.deleteCategoria(c._id! , this.auth.getToken()! ).subscribe({
        next: (res) => {
          alert(res.msg || 'Categoría eliminada correctamente');
          this.getCategorias();
        },
        error: (err) => alert('Error: ' + (err.error.msg || err.message)),
      });
    }
}
