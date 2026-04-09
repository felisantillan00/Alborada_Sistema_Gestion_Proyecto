import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { ReparacionView, ReparacionRequest } from '../../../core/models/reparacion';
import { ReparacionesService } from '../../../core/services/reparaciones/reparaciones-service';
import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';

@Component({
  selector: 'app-modal-reparacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-view-reparaciones.html',
})
export class ModalViewReparaciones implements OnInit {

  @Input() mode: 'create' | 'view' | 'edit' | 'delete' = 'create';
  @Input() reparacion: ReparacionView | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  // 🔹 SERVICIOS
  private fb = inject(FormBuilder);
  private reparacionesService = inject(ReparacionesService);
  private productoService = inject(ProductoService);

  // 🔹 DATA
  productos: ProductoView[] = [];
  productosLoaded = false;

  // 🔹 FORMULARIO 
  form = this.fb.group({
    estadoReparacion: ['EN_REPARACION', Validators.required],
    valorManoDeObra: [0, [Validators.required, Validators.min(1)]],
    fechaConfirmada: [''],
    detalle: this.fb.array<FormGroup>([])
  });

  ngOnInit(): void {
    this.getProductos();
    this.addDetalle(); // arranca con una fila

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  // 🔹 FORM ARRAY
  get detalleFormArray(): FormArray<FormGroup> {
    return this.form.get('detalle') as FormArray<FormGroup>;
  }

  addDetalle(): void {
    this.detalleFormArray.push(this.createDetalleGroup());
  }

  removeDetalle(index: number): void {
    this.detalleFormArray.removeAt(index);
  }

  private createDetalleGroup(): FormGroup {
    return this.fb.group({
      idProducto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      valorVenta: [0]
    });
  }

  // 🔹 PRODUCTOS 
  getProductos(): void {
    this.productoService.getAll().subscribe((data: any) => {
      this.productos = data.content;
      this.productosLoaded = true;
    });
  }

  // 🔹 CALCULO TOTAL 
  get totalCalculado(): number {
    const productosTotal = this.detalleFormArray.value.reduce(
      (acc: number, d: any) => acc + (d.valorVenta || 0) * (d.cantidad || 0),
      0
    );

    const manoDeObra = this.form.value.valorManoDeObra || 0;

    return productosTotal + manoDeObra;
  }

  // 🔹 SUBMIT
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
  console.log('CREATE', payload);

  // this.reparacionesService.create(payload)

  this.submitted.emit(payload);
  this.closed.emit();
}

handleEdit(): void {
  const payload = this.buildPayload(true);
  console.log('EDIT', payload);

  // this.reparacionesService.update(payload)

  this.submitted.emit(payload);
  this.closed.emit();
}

handleDelete(): void {
  console.log('DELETE', this.reparacion?.id);

  // this.reparacionesService.delete(this.reparacion?.id)

  this.closed.emit();
}

handleTerminar(): void {
  console.log('TERMINAR', this.reparacion?.id);

  // this.reparacionesService.terminar(this.reparacion?.id)

  this.closed.emit();
}

buildPayload(includeId: boolean = false): any {
  const payload: any = {
    estadoReparacion: this.form.value.estadoReparacion,
    valorTotal: this.totalCalculado,
    valorManoDeObra: this.form.value.valorManoDeObra,
    fechaConfirmada: this.form.value.fechaConfirmada,
    detalle: this.detalleFormArray.value
  };

  if (includeId && this.reparacion) {
    payload.id = this.reparacion.id;
  }

  return payload;
}

  onProductoChange(index: number): void {
    const control = this.detalleFormArray.at(index);
    const productoId = control.get('idProducto')?.value;
    const producto = this.productos.find(p => p.id === productoId);

    if (producto) {
      control.patchValue({
        valorVenta: producto.precioVenta
      });
    }
  }
}