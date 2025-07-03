import { Component } from '@angular/core';
import {  EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() optionSelected = new EventEmitter<string>();

  selectOption(option: string): void {
    this.optionSelected.emit(option);
  }
}
