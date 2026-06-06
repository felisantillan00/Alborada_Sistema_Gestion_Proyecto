import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router'; // 1. Importar provideRouter
import { MainLayout } from './main-layout';

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      // 2. Proveer una configuración de rutas simulada para el test
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;

    // Opcional: Recomiendo usar detectChanges() en lugar de whenStable() 
    // para inicializar el componente sincrónicamente en este punto.
    fixture.detectChanges();
  });

  it('should create', () => {
    // 3. Descomentar el expect, ¡ahora el test pasará!
    expect(component).toBeTruthy();
  });
});
