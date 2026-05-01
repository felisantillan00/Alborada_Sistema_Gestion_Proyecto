import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import {
  Component, EventEmitter, inject, Input,
  OnChanges, Output, SimpleChanges, OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaView, VentaRequest } from '../../../core/models/venta';
import { VentasService } from '../../../core/services/ventas/ventas-service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormaPago, FORMAS_PAGO } from '../../../core/models/compra';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

export function noFechaFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    const fechaIngresada = new Date(control.value);
    return fechaIngresada > hoy ? { fechaFutura: true } : null;
  };
}

// Validator: rechaza strings que sean solo espacios en blanco
export function noSoloEspacios(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // deja pasar vacío (es opcional)
    return control.value.trim().length === 0 ? { soloEspacios: true } : null;
  };
}

@Component({
  selector: 'app-modal-view-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-view-ventas.html',
})
export class ModalViewVentas implements OnChanges, OnInit {
  formasPago = FORMAS_PAGO;
  @Input() mode: ModalMode = 'create';
  @Input() venta: VentaView | null = null;

  productos: ProductoView[] = [];
  productosLoaded = false;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductoService);
  private ventasService = inject(VentasService);
  private cdr = inject(ChangeDetectorRef);

  today: string = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    nombreCliente: ['', Validators.required],
    total: [null as number | null, [Validators.required, Validators.min(1)]],
    fechaVenta: ['', [Validators.required, noFechaFutura()]],
    formaPago: [null as FormaPago | null, Validators.required],
    observacion: ['', [Validators.minLength(3), Validators.maxLength(255), noSoloEspacios()]],
    detalles: this.fb.array<FormGroup>([]),
  });

  ngOnInit(): void {
    this.getProductos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venta'] || changes['mode']) {
      this.loadForm();
      if (this.venta && this.productosLoaded) {
        this.setDetallesEnFormArray();
      }
    }
  }

  get detallesFormArray(): FormArray<FormGroup> {
    return this.form.get('detalles') as FormArray<FormGroup>;
  }

  get detallesControls(): FormGroup[] {
    return this.detallesFormArray.controls as FormGroup[];
  }

  addDetalle(): void {
    this.detallesFormArray.push(this.createDetalleGroup());
  }

  removeDetalle(index: number): void {
    this.detallesFormArray.removeAt(index);
  }

  getProductos(): void {
    this.productService.getAll().subscribe(data => {
      this.productos = (data as any).content;
      this.productosLoaded = true;
      if (this.venta) {
        this.setDetallesEnFormArray();
      }
    });
  }

  private loadForm(): void {
    // fecha ISO del backend → YYYY-MM-DD para el input date
    const fechaFormateada = this.venta?.fechaVenta
      ? this.venta.fechaVenta.substring(0, 10)  // toma solo "YYYY-MM-DD"
      : '';

    const formaPagoNormalizada = this.venta?.formaPago
    ? (this.venta.formaPago.trim().toUpperCase() as FormaPago)
    : null; // 👈

    this.form.patchValue({
      nombreCliente: this.venta?.nombreCliente ?? '',
      total: this.venta?.total ?? null,
      fechaVenta: fechaFormateada,
      formaPago: formaPagoNormalizada,
      observacion: this.venta?.observacion ?? '',
    });

    this.detallesFormArray.clear();

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
    if (!this.venta) return;

    this.detallesFormArray.clear();

    const productosArray = (this.venta as any).Productos || this.venta.detalles || [];

    productosArray.forEach((p: any) => {
      const idProducto = p.idProducto ? Number(p.idProducto) : null;
      const productoEncontrado = this.productos.find(prod => prod.id === idProducto);
      const nombreProducto = productoEncontrado ? productoEncontrado.nombre : p.nombre || '';

      this.detallesFormArray.push(
        this.createDetalleGroup(
          idProducto,           // id
          p.Cantidad ?? p.cantidad,
          p.PrecioVenta ?? p.precioUnitario ?? p.precioVenta,
          nombreProducto // nombre para mostrar en view
        )
      );
    });
    if (this.mode === 'view') {
      this.detallesFormArray.disable();
    }

    this.cdr.detectChanges();
  }

  private createDetalleGroup(
    idProducto: number | null = null,
    cantidad: number | null = null,
    precioUnitario: number | null = null,
    nombre: string = ''
  ): FormGroup {
    return this.fb.group({
      idProducto: [idProducto, [Validators.required, Validators.min(1)]],
      nombre: [nombre], // solo para mostrar en view, no se envía al backend
      cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      precioUnitario: [precioUnitario],   // solo lectura en view/edit
    });
  }

  private buildPayload(includeId = false): VentaRequest {
    const v = this.form.getRawValue();
    const fechaISO = v.fechaVenta ? `${v.fechaVenta}T00:00:00` : '';
    const payload: VentaRequest = {
      nombreCliente: v.nombreCliente!,
      total: v.total!,
      fechaVenta: fechaISO,
      formaPago: v.formaPago!,
      observacion: v.observacion ?? '',
      detalles: (v.detalles ?? []).map((d: any) => ({
        idProducto: d.idProducto,
        cantidad: d.cantidad,
      })),
    };
    return payload;
  }

  onSubmit(): void {
    this.detallesFormArray.controls.forEach(group => group.markAllAsTouched());
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    switch (this.mode) {
      case 'create': this.handleCreate(); break;
      case 'edit': this.handleEdit(); break;
      case 'delete': this.handleDelete(); break;
    }
  }

  handleCreate(): void {
    const payload = this.buildPayload();
     console.log('PAYLOAD ENVIADO:', JSON.stringify(payload, null, 2));
    this.ventasService.create(payload).subscribe({
      next: () => {
        this.showSuccess('Venta creada correctamente');
        this.submitted.emit('create');
        this.closed.emit();
      },
      error: (err) => {
        console.log('Error al crear venta:', err.error);
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';
        this.showError(errorMensaje);
      }
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
      error: (err) => {
        console.log('Error al editar venta:', err.error);
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';
        this.showError(errorMensaje);
      }
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
      error: (err) =>{
        console.log('Error al eliminar venta:', err.error);
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';
        this.showError(errorMensaje);
      } 
    });
  }

  get title(): string {
    const titles: Record<ModalMode, string> = {
      create: 'Nueva Venta',
      view: 'Venta',
      edit: 'Editar Venta',
      delete: 'Borrar Venta',
    };
    return titles[this.mode] ?? 'Venta';
  }

  showSuccess(message: string): void {
    Swal.fire({ icon: 'success', title: 'OK', text: message, confirmButtonText: 'Aceptar' });
  }

  showError(mensaje : string = 'Ocurrio un error'): void {
    Swal.fire({ icon: 'error', title: 'Error', text: mensaje, confirmButtonText: 'Aceptar' });
  }
}
