import { Component, EventEmitter, Output } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-cuenta',
  imports: [CommonModule],
  templateUrl: './aside-cuenta.component.html',
  styleUrl: './aside-cuenta.component.css'
})
export class AsideCuentaComponent {
  @Output() optionSelected = new EventEmitter<string>();
  currentUser: Usuario | null = null;
  private userSubscription!: Subscription;
  
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

  selectOption(option: string): void {
    this.optionSelected.emit(option);
  }

}
