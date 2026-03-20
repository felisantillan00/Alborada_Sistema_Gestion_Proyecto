import { Component, Input } from '@angular/core';
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
export class Sidebar {
  // Recibo el estado desde el main-layout para saber si colapsar
  @Input() isCollapsed = false;

  //Defino las opciones del menú
  menuItems: MenuItem[] = [
    { name: 'Inventario', icon: 'bi-box-seam', route: '/inventario' },
    { name: 'Ventas', icon: 'bi-cart2', route: '/ventas' },
    { name: 'Compras', icon: 'bi-bag', route: '/compras' },
    { name: 'Reparaciones', icon: 'bi-tools', route: '/reparaciones' },
    { name: 'Balance', icon: 'bi-graph-up', route: '/balance' }
  ];
}
