import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEntradasComponent } from './lista-entradas.component';

describe('ListaEntradasComponent', () => {
  let component: ListaEntradasComponent;
  let fixture: ComponentFixture<ListaEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEntradasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
