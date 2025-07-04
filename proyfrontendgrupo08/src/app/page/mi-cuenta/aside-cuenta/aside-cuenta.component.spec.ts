import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideCuentaComponent } from './aside-cuenta.component';

describe('AsideCuentaComponent', () => {
  let component: AsideCuentaComponent;
  let fixture: ComponentFixture<AsideCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
