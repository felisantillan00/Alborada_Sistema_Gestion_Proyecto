import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompraView } from '../../../core/models/compra';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-view-compras.html',
})
export class ModalViewCompras implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() compra: CompraView | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();
  private fb = inject(FormBuilder);

  form = this.fb.group({
    Id: [''],
    PrecioTotal: [0, Validators.required],
    NombreProveedor: ['', Validators.required],
    Fecha: [''],
    Producto: this.fb.array<FormGroup>([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compra'] || changes['mode']) {
      this.loadForm();
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

  private loadForm(): void {
    this.form.patchValue({
      Id: this.compra?.Id ?? '',
      PrecioTotal: this.compra?.PrecioTotal ?? 0,
      NombreProveedor: this.compra?.NombreProveedor ?? '',
      Fecha: this.compra?.Fecha ?? '',
    });

    this.productoFormArray.clear();

    if (this.compra?.Producto?.length) {
      this.compra.Producto.forEach((producto) => {
        this.productoFormArray.push(
          this.createProductoGroup(producto.Id, producto.Cantidad, producto.Precio)
        );
      });
    } else {
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
}
