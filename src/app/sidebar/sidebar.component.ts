import { Component, OnDestroy, OnInit } from '@angular/core';
import {  EventEmitter, Output } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
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
