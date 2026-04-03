import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompraView } from '../../../core/models/compra';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { ComprasService } from '../../../core/services/compras/compras-service';
import { ProductoView } from '../../../core/models/producto';
import Swal from 'sweetalert2';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-view-compras.html',
})
export class ModalViewCompras implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() compra: CompraView | null = null;

  productos: ProductoView[] = [];
  productosLoaded = false;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();
  private fb = inject(FormBuilder);
  private productService = inject(ProductoService);
  private comprasService = inject(ComprasService);

  ngOnInit(): void {
    this.getProductos();
  }

  form = this.fb.group({
    PrecioTotal: [0, [Validators.required, Validators.min(1)]],
    NombreProveedor: ['', Validators.required],
    Fecha: [''],
    Producto: this.fb.array<FormGroup>([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compra'] || changes['mode']) {
      this.loadForm();
      if (this.productosLoaded) {
        this.setProductosEnFormArray();
      }
    }
  }

  get productoFormArray(): FormArray<FormGroup> {
    return this.form.get('Producto') as FormArray<FormGroup>;
  }

  get precioLabel(): string {
    return this.compra ? 'Precio' : 'PrecioCompra';
  }

  addProducto(): void {
    this.productoFormArray.push(this.createProductoGroup());
  }

  removeProducto(index: number): void {
    this.productoFormArray.removeAt(index);
  }

  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    switch (this.mode) {
      case 'create':
        this.handleCreate();
        break;

      case 'edit':
        this.handleEdit();
        break;

      case 'delete':
        this.handleDelete();
        break;
    }
  }

  handleCreate(): void {
    const payload = this.buildPayload();

    this.comprasService.create(payload).subscribe({
      next: () => {
        this.showSuccess('Compra creada correctamente');
        this.closed.emit();
      },
      error: () => {
        this.showError();
      }
    });
  }

  handleEdit(): void {
    const payload = this.buildPayload(true);

    this.comprasService.update(this.compra!.Id, payload).subscribe({
      next: () => {
        this.showSuccess('Compra editada correctamente');
        this.closed.emit();
      },
      error: () => {
        this.showError();
      }
    });
  }

  handleDelete(): void {
    if (!this.compra?.Id) return;

    this.comprasService.delete(this.compra.Id).subscribe({
      next: () => {
        this.showSuccess('Compra eliminada correctamente');
        this.closed.emit();
      },
      error: () => {
        this.showError();
      }
    });
  }

  buildPayload(includeId: boolean = false): any {
    const v = this.form.value;
    const payload: any = {
      proveedor: v.NombreProveedor,
      precioTotal: v.PrecioTotal,
      fecha: v.Fecha,
      productos: (v.Producto || []).map((p: any) => ({
        id: p.Id,
        cantidad: p.Cantidad,
        precioCompra: p.PrecioCompra
      }))
    };

    if (includeId) {
      payload.id = this.compra?.Id;
    }

    return payload;
  }

  getProductos(): void {
    this.productService.getAll().subscribe(data => {
      this.productos = data;
      this.productosLoaded = true;

      if (this.compra) {
        this.setProductosEnFormArray();
      }
    });
  }

  private setProductosEnFormArray(): void {
    if (!this.compra?.Producto) return;

    this.productoFormArray.clear();

    this.compra.Producto.forEach((producto) => {
      this.productoFormArray.push(
        this.createProductoGroup(
          producto.Id,
          producto.Cantidad,
          producto.Precio
        )
      );
    });
  }

  private loadForm(): void {
    this.form.patchValue({
      PrecioTotal: this.compra?.PrecioTotal ?? 0,
      NombreProveedor: this.compra?.NombreProveedor ?? '',
      Fecha: this.compra?.Fecha ?? '',
    });

    this.productoFormArray.clear();

    if (!this.compra) {
      this.addProducto();
    }
  }

  private createProductoGroup(
    id: string = '',
    cantidad: number = 1,
    precioCompra: number | null = null
  ): FormGroup {
    return this.fb.group({
      Id: [id],
      Cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      PrecioCompra: [precioCompra, Validators.required],
    });
  }

  get title(): string {
    switch (this.mode) {
      case 'create':
        return 'Nueva Compra';
      case 'view':
        return 'Ver Compra';
      case 'edit':
        return 'Editar Compra';
      case 'delete':
        return 'Borrar Compra';
      default:
        return 'Compra';
    }
  }

  showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'OK',
      text: message
    });
  }
  showError(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un problema'
    });
  }
}