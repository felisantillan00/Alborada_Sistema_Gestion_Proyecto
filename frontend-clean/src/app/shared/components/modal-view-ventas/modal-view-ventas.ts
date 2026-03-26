import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaView } from '../../../core/models/venta';
import Swal from 'sweetalert2';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-view-ventas.html',
})
export class ModalViewVentas implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() venta: VentaView | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();
  private fb = inject(FormBuilder);

  form = this.fb.group({
    Id: [''],
    NombreCliente: ['', Validators.required],
    PrecioTotal: [0, [Validators.required, Validators.min(1)]],
    Fecha: [''],
    FormaDePago: ['', Validators.required],
    Productos: this.fb.array<FormGroup>([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venta'] || changes['mode']) {
      this.loadForm();
    }
  }

  get productosFormArray(): FormArray<FormGroup> {
    return this.form.get('Productos') as FormArray<FormGroup>;
  }

  get showPrecioVenta(): boolean {
    return this.venta !== null;
  }

  addProducto(): void {
    this.productosFormArray.push(this.createProductoGroup());
  }

  removeProducto(index: number): void {
    this.productosFormArray.removeAt(index);
  }

  private loadForm(): void {
    this.form.patchValue({
      Id: this.venta?.Id ?? '',
      NombreCliente: this.venta?.NombreCliente ?? '',
      PrecioTotal: this.venta?.PrecioTotal ?? 0,
      Fecha: this.venta?.Fecha ?? '',
      FormaDePago: this.venta?.FormaDePago ?? '',
    });

    this.productosFormArray.clear();

    if (this.venta?.Productos?.length) {
      this.venta.Productos.forEach((producto) => {
        this.productosFormArray.push(
          this.createProductoGroup(
            producto.Id,
            producto.Nombre,
            producto.Cantidad,
            producto.PrecioVenta
          )
        );
      });
    } else {
      this.addProducto();
    }
  }

  private createProductoGroup(
    id: string = '',
    nombre: string = '',
    cantidad: number = 1,
    precioVenta: number | null = null
  ): FormGroup {
    return this.fb.group({
      Id: [id],
      Nombre: [nombre],
      Cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      PrecioVenta: [precioVenta],
    });
  }

  get title(): string {
    switch (this.mode) {
      case 'create':
        return 'Nueva Venta';
      case 'view':
        return 'Ver Venta';
      case 'edit':
        return 'Editar Venta';
      case 'delete':
        return 'Borrar Venta';
      default:
        return 'Venta';
    }
  }

  onSubmit(mode: ModalMode): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    switch (mode) {
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
  console.log('CREATE venta:', payload);

  this.showSuccess('Venta creada correctamente');
  this.closed.emit();
}

handleEdit(): void {
  const payload = this.buildPayload(true);
  console.log('EDIT venta:', payload);

  this.showSuccess('Venta editada correctamente');
  this.closed.emit();
}

handleDelete(): void {
  console.log('DELETE venta:', this.venta?.Id);

  this.showSuccess('Venta eliminada correctamente');
  this.closed.emit();
}


buildPayload(includeId: boolean = false): any {
  const formValue = this.form.value;

  const payload: any = {
    nombreCliente: formValue.NombreCliente,
    precioTotal: formValue.PrecioTotal,
    fecha: formValue.Fecha,
    formaDePago: formValue.FormaDePago,
productos: (formValue.Productos || []).map((p: any) => ({      id: p.Id,
      cantidad: p.Cantidad,
      precioVenta: p.PrecioVenta
    }))
  };

  if (includeId) {
    payload.id = formValue.Id;
  }

  return payload;
}

showSuccess(message: string): void {
  Swal.fire({
    icon: 'success',
    title: 'OK',
    text: message
  });
}
}
