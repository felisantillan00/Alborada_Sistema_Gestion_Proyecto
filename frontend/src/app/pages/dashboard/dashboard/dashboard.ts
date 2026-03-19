import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../core/services/producto/producto-service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Asumiendo que es standalone por tu array de imports vacío
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  // 1. Inyectamos el servicio en el constructor
  constructor(private productoService: ProductoService) {}

  // 2. Este método se ejecuta automáticamente al cargar la página
  ngOnInit(): void {
    this.probarStockBajo();
    this.probarPaginacion();
  }

  // --- MÉTODOS DE PRUEBA ---

  probarStockBajo(): void {
    console.log('--- Iniciando prueba de Stock Bajo (Límite 5) ---');
    this.productoService.getProductosStockBajo(5).subscribe({
      next: (productos) => {
        console.log('✅ Éxito! Productos con stock <= 5:', productos);
      },
      error: (err) => {
        console.error('❌ Error al traer stock bajo:', err);
      }
    });
  }

  probarPaginacion(): void {
    // Pedimos la página 1, y le decimos que traiga solo 2 elementos por página
    console.log('--- Iniciando prueba de Paginación (Página 1, Límite 2) ---');
    this.productoService.getProductosPaginados(1, 2).subscribe({
      next: (productos) => {
        console.log('✅ Éxito! Productos de la página 1:', productos);
      },
      error: (err) => {
        console.error('❌ Error al traer paginación:', err);
      }
    });
  }
}