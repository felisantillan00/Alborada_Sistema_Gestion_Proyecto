import { CommonModule } from '@angular/common';
import { ProductoView } from '../../../core/models/producto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Categoria } from '../../../core/models/categoria';
import { Proveedor } from '../../../core/models/proveedor';
import { Marca } from '../../../core/models/marca';
import { CategoriasService } from '../../../core/services/categorias/categorias-service';
import { ProveedoresService } from '../../../core/services/proveedores/proveedores-service';
import { MarcasService } from '../../../core/services/marcas/marcas-service';
import { catchError, EMPTY } from 'rxjs';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view',
  standalone: true,
  imports: [CommonModule, NgSelectModule],
  templateUrl: './modal-view.html',
  styleUrl: './modal-view.css',
})
export class ModalView implements OnInit {
  @Input() mode: ModalMode = 'create';
  @Input() product: ProductoView | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  marcas: Marca[] = [];

  constructor(
    private categoriasService: CategoriasService,
    private proveedoresService: ProveedoresService,
    private marcasService: MarcasService,
  ) {}

  ngOnInit(): void {
    this.getCategorias();
    this.getProveedores();
    this.getMarcas();
  }

  getMarcas(): void {
    this.marcasService.getAll().pipe(
      catchError(err => {
        console.error('Error al cargar marcas', err);
        return EMPTY;
      })
    ).subscribe(data => {this.marcas = data; console.log('Marcas cargadas:', data);});
  }

  getProveedores(): void {
    this.proveedoresService.getAll().pipe(
      catchError(err => {
        console.error('Error al cargar proveedores', err);
        return EMPTY;
      })
    ).subscribe(data => {this.proveedores = data; console.log('Proveedores cargados:', data);});
  }

  getCategorias(): void {
    this.categoriasService.getAll().pipe(
      catchError(err => {
        console.error('Error al cargar categorías', err);
        return EMPTY;
      })
    ).subscribe(data => {this.categorias = data; console.log('Categorías cargadas:', data);});
  }

  get title(): string {
    switch (this.mode) {
      case 'create':  return 'Nuevo Producto';
      case 'view':    return 'Ver Producto';
      case 'edit':    return 'Editar Producto';
      case 'delete':  return 'Borrar Producto';
      default:        return 'Producto';
    }
  }
}


