import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-confirmacion-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmacion-email.component.html',
  styleUrls: ['./confirmacion-email.component.css']
})
export class ConfirmacionEmailComponent implements OnInit {
  
  mensaje: string = 'Verificando tu cuenta, por favor espera...';
  estado: 'cargando' | 'exito' | 'error' = 'cargando';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    
    if (token) {
      this.authService.confirmarEmail(token).subscribe({
        next: (response) => {
          this.mensaje = response.msg;
          this.estado = 'exito';
        },
        error: (err) => {
          this.mensaje = err.message || 'El token es inválido o ha expirado.';
          this.estado = 'error';
        }
      });
    } else {
      this.mensaje = 'No se proporcionó un token de confirmación en la URL.';
      this.estado = 'error';
    }
  }
}