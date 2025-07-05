import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrganizadorComponent } from './form-organizador.component';

describe('FormOrganizadorComponent', () => {
  let component: FormOrganizadorComponent;
  let fixture: ComponentFixture<FormOrganizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOrganizadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOrganizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
