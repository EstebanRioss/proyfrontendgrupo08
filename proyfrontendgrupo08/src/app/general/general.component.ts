import { AfterViewInit, Component, Input } from '@angular/core';
import { EventosService } from '../service/eventos.service';
import { EntradaService } from '../service/entrada.service';
import { UsuarioService } from '../service/usuario.service';
import { Entrada } from '../models/entrada';
import { Evento } from '../models/evento';
import { Usuario } from '../models/usuario';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

@Component({
  selector: 'app-general',
  imports: [CommonModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent{
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
    this.crearOActualizarGrafico();
  }
  crearOActualizarGrafico(){
    this.calcularResumen();
    const ctx = document.getElementById('resumenChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Usuarios', 'Eventos', 'Entradas', 'Ganancias'],
        datasets: [{
          label: 'Resumen',
          data: [
            this.totalUsuarios,
            this.totalEventos,
            this.totalEntradas,
            this.totalGanancias
          ],
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f6c23e'
          ],
          borderColor: [
            '#2e59d9',
            '#17a673',
            '#2c9faf',
            '#dda20a'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
    this.currentUser = user;

    forkJoin({
        entradas: this.serviceEn.getEntradas(),
        eventos: this.serviceE.getEventos(),
        usuarios: this.serviceU.getUsuarios()
      }).subscribe(({ entradas, eventos, usuarios }) => {
        this.Entradas = entradas.map((e: any) => Object.assign(new Entrada(), e));
        this.Eventos = eventos.map((e: any) => Object.assign(new Evento(), e));
        this.Usuarios = usuarios.map((u: any) => Object.assign(new Usuario(), u));

        this.calcularResumen();
        this.crearOActualizarGrafico();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
