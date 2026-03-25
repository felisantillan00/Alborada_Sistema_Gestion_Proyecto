import { CommonModule } from '@angular/common';
import { ProductoView } from '../../../core/models/producto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, NgSelectModule, FormsModule],
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

  proveedorSelectID: number | null = null;
  categoriaSelectID: number | null = null
  marcaSelectID: number | null = null;

  constructor(
    private categoriasService: CategoriasService,
    private proveedoresService: ProveedoresService,
    private marcasService: MarcasService,
  ) { }

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
    ).subscribe(data => {
      this.marcas = data;
      console.log('nombreMarca del producto:', this.product?.nombreMarca);
console.log('nombres en array marcas:', this.marcas.map(m => m.nombre));
      if (this.mode === 'edit' || this.mode === 'view') {
        console.log('product al momento del find:', this.product);
        const marca = this.marcas.find(m => m.nombre === this.product?.nombreMarca);
        this.marcaSelectID = marca ? marca.id : null;
      }
      console.log('Marcas cargadas:', data)
      console.log(this.marcaSelectID);
    });
  }

  getProveedores(): void {
    this.proveedoresService.getAll().pipe(
      catchError(err => {
        console.error('Error al cargar proveedores', err);
        return EMPTY;
      })
    ).subscribe(data => { 
      this.proveedores = data; 
      console.log('nombreProveedor del producto:', this.product?.nombreProveedor);
console.log('nombres en array proveedores:', this.proveedores.map(p => p.nombre));
      if (this.mode === 'edit' || this.mode === 'view') {
        console.log('product al momento del find:', this.product);
        const proveedor = this.proveedores.find(p => p.nombre === this.product?.nombreProveedor);
        this.proveedorSelectID = proveedor ? proveedor.id : null;
      }
      console.log('Proveedores cargados:', data);
      console.log(this.proveedorSelectID);
    });
  }

  getCategorias(): void {
    this.categoriasService.getAll().pipe(
      catchError(err => {
        console.error('Error al cargar categorías', err);
        return EMPTY;
      })
    ).subscribe(data => { 
      this.categorias = data;
      console.log('nombreCategoria del producto:', this.product?.nombreCategoria);
console.log('nombres en array categorias:', this.categorias.map(c => c.nombre));
      if (this.mode === 'edit' || this.mode === 'view') {
        console.log('product al momento del find:', this.product);
        const categoria = this.categorias.find(c => c.nombre === this.product?.nombreCategoria);
        this.categoriaSelectID = categoria ? categoria.id : null;
      }
       console.log('Categorías cargadas:', data);
       console.log(this.categoriaSelectID);
     });
  }

  get title(): string {
    switch (this.mode) {
      case 'create': return 'Nuevo Producto';
      case 'view': return 'Ver Producto';
      case 'edit': return 'Editar Producto';
      case 'delete': return 'Borrar Producto';
      default: return 'Producto';
    }
  }
}


