import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import {
  Component, EventEmitter, inject, Input,
  OnChanges, Output, SimpleChanges, OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaView, VentaRequest } from '../../../core/models/venta';
import { VentasService } from '../../../core/services/ventas/ventas-service';
import Swal from 'sweetalert2';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-view-ventas.html',
})
export class ModalViewVentas implements OnChanges, OnInit {
  @Input() mode: ModalMode = 'create';
  @Input() venta: VentaView | null = null;

  productos: ProductoView[] = [];
  productosLoaded = false;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductoService);
  private ventasService = inject(VentasService);

  form = this.fb.group({
    nombreCliente: ['', Validators.required],
    total:         [0, [Validators.required, Validators.min(1)]],
    fechaVenta:    [''],
    formaPago:     ['', Validators.required],
    observacion:   [''],
    detalles: this.fb.array<FormGroup>([]),
  });

  ngOnInit(): void {
    this.getProductos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venta'] || changes['mode']) {
      this.loadForm();
      if (this.productosLoaded) {
        this.setDetallesEnFormArray();
      }
    }
  }

  get detallesFormArray(): FormArray<FormGroup> {
    return this.form.get('detalles') as FormArray<FormGroup>;
  }

  addDetalle(): void {
    this.detallesFormArray.push(this.createDetalleGroup());
  }

  removeDetalle(index: number): void {
    this.detallesFormArray.removeAt(index);
  }

  getProductos(): void {
    this.productService.getAll().subscribe(data => {
      this.productos = data;
      this.productosLoaded = true;
      if (this.venta) {
        this.setDetallesEnFormArray();
      }
    });
  }

  private loadForm(): void {
    this.form.patchValue({
      nombreCliente: this.venta?.nombreCliente ?? '',
      total:         this.venta?.total         ?? 0,
      fechaVenta:    this.venta?.fechaVenta     ?? '',
      formaPago:     this.venta?.formaPago      ?? '',
      observacion:   this.venta?.observacion    ?? '',
    });

    this.detallesFormArray.clear();

    // En create, arrancamos con una fila vacía
    if (!this.venta) {
      this.addDetalle();
    }

    if (this.mode === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private setDetallesEnFormArray(): void {
    if (!this.venta?.detalles) return;

    this.detallesFormArray.clear();

    this.venta.detalles.forEach(d => {
      this.detallesFormArray.push(
        this.createDetalleGroup(d.idProducto, d.cantidad, d.precioUnitario)
      );
    });

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  private createDetalleGroup(
    idProducto: number | null = null,
    cantidad:   number        = 1,
    precioUnitario: number | null = null
  ): FormGroup {
    return this.fb.group({
      idProducto:    [idProducto, Validators.required],
      cantidad:      [cantidad, [Validators.required, Validators.min(1)]],
      precioUnitario:[precioUnitario],   // solo lectura en view/edit
    });
  }

  private buildPayload(includeId = false): VentaRequest {
    const v = this.form.getRawValue();
    const payload: VentaRequest = {
      nombreCliente: v.nombreCliente!,
      total:         v.total!,
      formaPago:     v.formaPago!,
      observacion:   v.observacion ?? '',
      detalles: (v.detalles ?? []).map((d: any) => ({
        idProducto: d.idProducto,
        cantidad:   d.cantidad,
      })),
    };
    return payload;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    switch (this.mode) {
      case 'create': this.handleCreate(); break;
      case 'edit':   this.handleEdit();   break;
      case 'delete': this.handleDelete(); break;
    }
  }

  handleCreate(): void {
    const payload = this.buildPayload();
    this.ventasService.create(payload).subscribe({
      next: () => {
        this.showSuccess('Venta creada correctamente');
        this.submitted.emit('create');
        this.closed.emit();
      },
      error: () => this.showError(),
    });
  }

  handleEdit(): void {
    const payload = this.buildPayload(true);
    this.ventasService.update(this.venta!.id, payload).subscribe({
      next: () => {
        this.showSuccess('Venta editada correctamente');
        this.submitted.emit('edit');
        this.closed.emit();
      },
      error: () => this.showError(),
    });
  }

  handleDelete(): void {
    if (!this.venta?.id) return;
    this.ventasService.delete(this.venta.id).subscribe({
      next: () => {
        this.showSuccess('Venta eliminada correctamente');
        this.submitted.emit('delete');
        this.closed.emit();
      },
      error: () => this.showError(),
    });
  }

  get title(): string {
    const titles: Record<ModalMode, string> = {
      create: 'Nueva Venta',
      view:   'Ver Venta',
      edit:   'Editar Venta',
      delete: 'Borrar Venta',
    };
    return titles[this.mode] ?? 'Venta';
  }

  showSuccess(message: string): void {
    Swal.fire({ icon: 'success', title: 'OK', text: message, confirmButtonText: 'Aceptar' });
  }

  showError(): void {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un problema', confirmButtonText: 'Aceptar' });
  }
}