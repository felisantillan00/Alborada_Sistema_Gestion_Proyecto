import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    // ❌ ELIMINAMOS fixture.detectChanges() de aquí
  });

  it('should create', () => {
    fixture.detectChanges(); // ✅ Lo llamamos aquí
    expect(component).toBeTruthy();
  });

  describe('Responsividad y Resize', () => {
    it('debería detectar modo móvil si la pantalla es menor a 768px', () => {
      fixture.detectChanges(); // Inicializamos
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);

      component.checkScreenSize();
      expect(component.isMobile).toBe(true);
    });

    it('debería detectar modo escritorio y cerrar el menú si la pantalla es mayor a 768px', () => {
      fixture.detectChanges();
      component.isMobile = true;
      component.mobileMenuOpen = true;

      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
      component.checkScreenSize();

      expect(component.isMobile).toBe(false);
      expect(component.mobileMenuOpen).toBe(false);
    });
  });

  describe('Lógica del Menú Móvil', () => {
    it('debería alternar el estado del menú con toggleMobileMenu', () => {
      fixture.detectChanges();
      expect(component.mobileMenuOpen).toBe(false);

      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBe(true);

      component.toggleMobileMenu();
      expect(component.mobileMenuOpen).toBe(false);
    });

    it('debería cerrar el menú solo si está en modo móvil usando closeMobileMenu', () => {
      fixture.detectChanges();
      component.mobileMenuOpen = true;
      component.isMobile = false;

      component.closeMobileMenu();
      expect(component.mobileMenuOpen).toBe(true);

      component.isMobile = true;
      component.closeMobileMenu();
      expect(component.mobileMenuOpen).toBe(false);
    });
  });

  describe('Template y DOM', () => {
    it('debería aplicar la clase "collapsed" si isCollapsed es true y no es móvil', () => {
      // 1. Preparamos el estado ANTES de detectar cambios
      component.isCollapsed = true;
      component.isMobile = false;

      // 2. AHORA Angular renderiza el HTML con los valores correctos
      fixture.detectChanges();

      const sidebarDiv = fixture.debugElement.query(By.css('.sidebar')).nativeElement;
      expect(sidebarDiv.classList.contains('collapsed')).toBe(true);
    });

    it('debería renderizar la cantidad correcta de ítems en el menú', () => {
      fixture.detectChanges();
      const navItems = fixture.debugElement.queryAll(By.css('.nav-item'));
      expect(navItems.length).toBe(component.menuItems.length);
    });
  });
});
