import { Component } from '@angular/core';
import { CategoriaEvento } from '../models/categoria-evento';
import { CategoriaService } from '../service/categoria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-categoria',
  imports: [CommonModule,FormsModule],
  templateUrl: './form-categoria.component.html',
  styleUrl: './form-categoria.component.css'
})
export class FormCategoriaComponent {
  categoria : CategoriaEvento = {} as CategoriaEvento;
  id : string = "";

  constructor(private serviceC : CategoriaService, private router : Router , private activatedRoute : ActivatedRoute , private auth : AuthService){
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.cargarCategoria();
    }
  }

  cargarCategoria(): void {
    this.serviceC.getCategoria(this.id).subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (err) => {
        console.error('Error cargando la categoría:', err);
      }
    });
  }

  guardarCategoria(): void {
    const token = this.auth.getToken();

    if (this.id) {
      // Modo edición
      this.serviceC.updateCategoria(this.id, this.categoria,token!).subscribe({
        next: () => {
          alert('✅ Categoría actualizada correctamente');
          this.router.navigate(['/gestion']);
        },
        error: (err) => {
          console.error('Error actualizando categoría:', err);
          alert('❌ No se pudo actualizar la categoría');
        }
      });
    } else {
      // Modo creación
      this.serviceC.createCategoria(this.categoria , token!).subscribe({
        next: () => {
          alert('✅ Categoría creada correctamente');
          this.router.navigate(['/gestion']);
        },
        error: (err) => {
          console.error('Error creando categoría:', err);
          alert('❌ No se pudo crear la categoría');
        }
      });
    }
  }
}
