import { Component } from '@angular/core';
import { EventosService } from '../service/eventos.service';
import { EntradaService } from '../service/entrada.service';
import { UsuarioService } from '../service/usuario.service';
import { Entrada } from '../models/entrada';
import { Evento } from '../models/evento';
import { Usuario } from '../models/usuario';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-general',
  imports: [CommonModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent {
  Entradas : Array<Entrada>;
  Eventos : Array<Evento>;
  Usuarios : Array<Usuario>;

  totalUsuarios: number = 0;
  totalEventos: number = 0;
  totalEntradas: number = 0;
  totalGanancias: number = 0;
  entradasOrganizador: number = 0;
  eventoOrganizador: Array<Evento>;

  currentUser: Usuario | null = null;
  private userSubscription!: Subscription;

  constructor(private serviceE : EventosService , private serviceEn : EntradaService , private serviceU : UsuarioService,private authService: AuthService){
    this.Entradas = new Array<Entrada>();
    this.Eventos = new Array<Evento>();
    this.Usuarios = new Array<Usuario>();
    this.eventoOrganizador = new Array<Evento>();
    this.getEntradas();
    this.getEvento();
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

  getEntradas(){
        this.serviceEn.getEntradas().subscribe(
          result => {
            console.log(result);
            let ve: Entrada = new Entrada();
            result.forEach((element: any) => {
              Object.assign(ve, element);
              this.Entradas.push(ve);
              ve = new Entrada();

            });
            this.calcularResumen();
           }
          );
  }
  getEvento(){
    this.serviceE.getEventos().subscribe(
      result => {
        console.log(result);
        let vevento: Evento = new Evento();
        result.forEach((element: any) => {
          Object.assign(vevento, element);
          this.Eventos.push(vevento);
          vevento = new Evento();
        });
        this.calcularResumen();
       }
      );
    }
  getUsuarios(){
        this.serviceU.getUsuarios(this.authService.getToken()).subscribe(
          result => {
            console.log(result);
            let vusuario: Usuario = new Usuario();
            result.forEach((element: any) => {
              Object.assign(vusuario, element);
              this.Usuarios.push(vusuario);
              vusuario = new Usuario();
            });
            this.calcularResumen();
           }
          );
    }
    calcularResumen() {
      if(this.currentUser?.rol == "organizador"){
        let idOrganizador: string | undefined = this.currentUser?._id;
        this.totalEventos = this.Eventos.filter(evento => evento.organizadorId === idOrganizador).length;

        let idsEventos = this.eventoOrganizador.map(e => e._id);

        let entradasFiltradas = this.Entradas.filter(entrada => {
        // entrada.eventoId puede ser string | Evento | undefined
        if (typeof entrada.eventoId === 'string') {
          return idsEventos.includes(entrada.eventoId);
        }
        return false;
        });
        this.totalEntradas = entradasFiltradas.length;

        this.totalGanancias = entradasFiltradas.reduce((total, e) => total + (e.precio || 0), 0);
        return
      }
      this.totalUsuarios = this.Usuarios.length;
      this.totalEventos = this.Eventos.length;
      this.totalEntradas = this.Entradas.length;
      this.totalGanancias = this.Entradas.reduce((total, e) => total + (e.precio || 0), 0);
    }



}
