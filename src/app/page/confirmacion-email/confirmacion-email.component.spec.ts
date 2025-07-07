import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionEmailComponent } from './confirmacion-email.component';

describe('ConfirmacionEmailComponent', () => {
  let component: ConfirmacionEmailComponent;
  let fixture: ComponentFixture<ConfirmacionEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
