import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../service/usuario.service';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  imports: [CommonModule,RouterModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit, OnDestroy {
  Usuarios : Array<Usuario>;
  currentUser: Usuario | null = null;
  private userSubscription!: Subscription;
    constructor(private service  : UsuarioService , private router : Router, private authService: AuthService){
      this.Usuarios = new Array<Usuario>();
      this.getUsuarios();
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

    getUsuarios(){
        this.service.getUsuarios(this.authService.getToken()).subscribe(
          result => {
            console.log(result);
            let vusuario: Usuario = new Usuario();
            result.forEach((element: any) => {
              Object.assign(vusuario, element);
              this.Usuarios.push(vusuario);
              vusuario = new Usuario();
            });
           }
          );
    }
    Modificar(u : Usuario){
          this.router.navigate(['evento', u._id])
      }
        
    Eliminar(u : Usuario){
          this.router.navigate(['evento', u._id])
      }
    
}
