import { CommonModule } from '@angular/common';
import { ProductoRequest, ProductoView } from '../../../core/models/producto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Categoria } from '../../../core/models/categoria';
import { Proveedor } from '../../../core/models/proveedor';
import { Marca } from '../../../core/models/marca';
import { CategoriasService } from '../../../core/services/categorias/categorias-service';
import { ProveedoresService } from '../../../core/services/proveedores/proveedores-service';
import { MarcasService } from '../../../core/services/marcas/marcas-service';
import Swal from 'sweetalert2';
import { catchError, EMPTY } from 'rxjs';
import { forkJoin } from 'rxjs';

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

    if (this.mode === 'edit' || this.mode === 'view') {
      this.patchForm();
    }

    this.loadSelects();

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  get Control() {
    return this.form.controls;
  }

  loadSelects(): void {
    forkJoin({
      categorias: this.categoriasService.getPage(),
      proveedores: this.proveedoresService.getPage(),
      marcas: this.marcasService.getPage()
    }).pipe(
      catchError(err => {
        console.error('Error cargando selects', err);
        return EMPTY;
      })
    ).subscribe(({ categorias, proveedores, marcas }) => {
      this.categorias = categorias.content;
      this.proveedores = proveedores.content;
      this.marcas = marcas.content;

      if (this.mode === 'edit' || this.mode === 'view') {
        this.setSelectValues();
      }
    });
  }

  private initForm(): void {
    const isViewMode = this.mode === 'view';
    const p = this.product;

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      proveedorId: [null, Validators.required],
      categoriaId: [null, Validators.required],
      marcaId: [null, Validators.required],
    });
  }

  private patchForm(): void {
    if (!this.product) return;
    this.form.patchValue({
      nombre: this.product.nombre,
      stock: this.product.stock,
      precioCompra: this.product.precioCompra,
      precioVenta: this.product.precioVenta,
    });
  }

  private setSelectValues(): void {
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

  private buildPayload(incluedID = false): ProductoRequest {
    const v = this.form.getRawValue();
    return {
      id: incluedID ? (this.product?.id ?? 0) : 0,
      nombre: v.nombre,
      precioCompra: v.precioCompra,
      precioVenta: v.precioVenta,
      stock: v.stock,
      proveedorId: v.proveedorId,
      categoriaId: v.categoriaId,
      marcaId: v.marcaId,
    };
  }

  private showSuccess(mensaje: string): void {
    Swal.fire({
      icon: 'success',
      title: 'OK',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    })
  }
  getMarcas(): void {
    this.marcasService.getAll().pipe(
      catchError(err => {
        console.error('Error al cargar marcas', err);
        return EMPTY;
      })
    ).subscribe(data => {
      this.marcas = data;
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

  onSubmit(): void {
    switch (this.mode) {
      case 'create': this.handleCreate(); break;
      case 'edit': this.handleEdit(); break;
      case 'delete': this.handleDelete(); break;
    }
  }

  private handleCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.buildPayload();
    console.log('creado', payload);
    this.showSuccess('Producto creado exitosamente');
    this.closed.emit();
  }

  private handleEdit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.buildPayload(true);
    console.log('editado', payload);
    this.showSuccess('Producto editado exitosamente');
    this.closed.emit();
  }

  private handleDelete(): void {
    const payload = { id: this.product?.id }
    console.log('borrado', payload);
    this.showSuccess('Producto borrado exitosamente');
    this.closed.emit();
  }
}
