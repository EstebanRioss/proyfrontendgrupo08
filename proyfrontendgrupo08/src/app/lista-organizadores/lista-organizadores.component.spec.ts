import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrganizadoresComponent } from './lista-organizadores.component';

describe('ListaOrganizadoresComponent', () => {
  let component: ListaOrganizadoresComponent;
  let fixture: ComponentFixture<ListaOrganizadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaOrganizadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaOrganizadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
