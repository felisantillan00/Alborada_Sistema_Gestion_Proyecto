import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { Producto } from '../../../core/models/producto';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-inventario',
  imports: [],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario {

  producto: Producto[] | undefined;

  constructor(private productoService: ProductoService) { }

  ngOnInit() {
    this.getProductos();
  }

  getProductos() {
    this.productoService.getAll()
      .pipe(
        catchError(error => {
          console.error('Error al obtener productos:', error);
          return of([]); // devuelve array vacío para no romper la app
        })
      )
      .subscribe(data => {
        this.producto = data;
        console.log(this.producto)
      });
  }
}
