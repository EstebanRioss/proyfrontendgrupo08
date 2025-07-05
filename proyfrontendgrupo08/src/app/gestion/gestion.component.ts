import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListaCategoriasComponent } from '../lista-categorias/lista-categorias.component';
import { ListaEntradasComponent } from '../lista-entradas/lista-entradas.component';
import { ListaEventosComponent } from '../lista-eventos/lista-eventos.component';
import { ListaUsuariosComponent } from '../lista-usuarios/lista-usuarios.component';
import { ListaOrganizadoresComponent } from '../lista-organizadores/lista-organizadores.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Usuario } from '../models/usuario';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { GeneralComponent } from '../general/general.component';

@Component({
  selector: 'app-gestion',
  imports: [ListaCategoriasComponent,ListaEntradasComponent,ListaEventosComponent,ListaUsuariosComponent,ListaOrganizadoresComponent,SidebarComponent,CommonModule,GeneralComponent],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.css'
})
export class GestionComponent implements OnInit, OnDestroy {
  currentUser: Usuario | null = null;
  private userSubscription!: Subscription;
  selectedOption: string = 'users';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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

  onOptionSelected(option: string): void {
    this.selectedOption = option;
  }

  

}
