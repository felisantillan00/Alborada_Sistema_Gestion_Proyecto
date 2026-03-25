import { CommonModule } from '@angular/common';
import { ProductoView } from '../../../core/models/producto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
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

  form!: FormGroup;  

  constructor(
    private fb: FormBuilder,
    private categoriasService: CategoriasService,
    private proveedoresService: ProveedoresService,
    private marcasService: MarcasService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    if(this.mode === 'edit' || this.mode === 'view') {
      this.patchForm();
    }
    this.getCategorias();
    this.getProveedores();
    this.getMarcas();
    if(this.mode === 'view') {
      this.form.disable();
    }
  }

  private initForm(): void {
    const isViewMode = this.mode === 'view';
    const p = this.product;

    this.form = this.fb.group({
      nombre:       [ '' , Validators.required],
      stock:        [ 0,   [Validators.required, Validators.min(0)]],
      precioCompra: [ 0,   [Validators.required, Validators.min(0)]],
      precioVenta:  [ 0,   [Validators.required, Validators.min(0)]],
      proveedorId:  [ null,  Validators.required],
      categoriaId:  [null, Validators.required],
      marcaId:      [ null, Validators.required],
    });
  }

  private patchForm(): void {
  if (!this.product) return;
  this.form.patchValue({
    nombre:       this.product.nombre,
    stock:        this.product.stock,
    precioCompra: this.product.precioCompra,
    precioVenta:  this.product.precioVenta,
  });
  }

  private setSelectValues():void{
    if (!this.product) return;
    const categoria = this.categorias.find(c => c.nombre === this.product?.nombreCategoria);
    const proveedor = this.proveedores.find(p => p.nombre === this.product?.nombreProveedor);
    const marca = this.marcas.find(m => m.nombre === this.product?.nombreMarca);

    this.form.patchValue({
      categoriaId: categoria?.id ?? null,
      proveedorId: proveedor?.id ?? null,
      marcaId: marca?.id ?? null,
    });
  }
  getMarcas(): void {
    this.marcasService.getAll().pipe(
      catchError(err => {
        console.error('Error al cargar marcas', err);
        return EMPTY;
      })
    ).subscribe(data => {
      this.marcas = data;
      if (this.mode === 'edit' || this.mode === 'view') {
        const marca = this.marcas.find(m => m.nombre === this.product?.nombreMarca);
        this.setSelectValues();
      }
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
      if (this.mode === 'edit' || this.mode === 'view') {
        const proveedor = this.proveedores.find(p => p.nombre === this.product?.nombreProveedor);
        this.setSelectValues();
      }
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
      if (this.mode === 'edit' || this.mode === 'view') {
        const categoria = this.categorias.find(c => c.nombre === this.product?.nombreCategoria);
        this.setSelectValues();
      }
    });
  }

  get title(): string {
    switch (this.mode) {
      case 'create': return 'Nuevo Producto';
      case 'view':   return 'Ver Producto';
      case 'edit':   return 'Editar Producto';
      case 'delete': return 'Borrar Producto';
      default:       return 'Producto';
    }
  }

  onSubmit(): void {
    switch(this.mode){
      case 'create': this.handleCreate(); break;
      case 'edit': this.handleEdit(); break;
      case 'delete': this.handleDelete(); break;
    }
  }

  private handleCreate(): void {
    if (this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit('create');
  }

  private handleEdit(): void {
    if (this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit('edit');
  }

  private handleDelete(): void {
    this.submitted.emit('delete');  
  }
}