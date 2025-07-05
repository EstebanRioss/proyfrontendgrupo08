import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraEntradaComponent } from './compra-entrada.component';

describe('CompraEntradaComponent', () => {
  let component: CompraEntradaComponent;
  let fixture: ComponentFixture<CompraEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraEntradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
