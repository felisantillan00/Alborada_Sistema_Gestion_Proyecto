import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Categoria } from '../../../core/models/categoria';
import { Proveedor } from '../../../core/models/proveedor';
import { Marca } from '../../../core/models/marca';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view',
  standalone: true,
  imports: [CommonModule, NgSelectModule],
  templateUrl: './modal-view.html',
  styleUrl: './modal-view.css',
})
export class ModalView {
  @Input() mode: ModalMode = 'create';
  @Input() product: ProductoView | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

  categorias : Categoria[] = [];
  proveedores : Proveedor[] = [];
  marcas : Marca[] = [];

  getMarcas(){
    //logica de servicio para traer las marcas
  }

  getProveedores(){
    //logica de servicio para traer los proveedores
  }

  getCategorias(){
    //logica de servicio para traer las categorias
  }

  get title(): string {
    switch (this.mode) {
      case 'create':
        return 'Nuevo Producto';
      case 'view':
        return 'Ver Producto';
      case 'edit':
        return 'Editar Producto';
      case 'delete':
        return 'Borrar Producto';
      default:
        return 'Producto';
    }
  }
}
