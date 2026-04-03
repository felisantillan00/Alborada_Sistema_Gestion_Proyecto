import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

//Creo la interfaz. El signo de (?) significa que es opcional.
interface MenuItem {
  name: string;
  icon: string;
  route: string;
  badge?: number;      // Preparado para el backend
  badgeColor?: string; // Preparado para el backend
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  // Recibo el estado desde el main-layout para saber si colapsar
  @Input() isCollapsed = false;

  isMobile = false;
  mobileMenuOpen = false;

  //Defino las opciones del menú
  menuItems: MenuItem[] = [
    { name: 'Inventario', icon: 'bi-box-seam', route: '/inventario' },
    { name: 'Ventas', icon: 'bi-cart2', route: '/ventas' },
    { name: 'Compras', icon: 'bi-bag', route: '/compras' },
    { name: 'Reparaciones', icon: 'bi-tools', route: '/reparaciones' },
    { name: 'Balance', icon: 'bi-graph-up', route: '/balance' }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // breakpoint de Boostrap para celulares
    if(!this.isMobile) {
      this.mobileMenuOpen = false; // cierro el menú móvil si paso a desktop
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    if(this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }
}
