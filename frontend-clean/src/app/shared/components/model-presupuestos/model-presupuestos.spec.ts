import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPresupuestos } from './model-presupuestos';

describe('ModelPresupuestos', () => {
  let component: ModelPresupuestos;
  let fixture: ComponentFixture<ModelPresupuestos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelPresupuestos],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelPresupuestos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
