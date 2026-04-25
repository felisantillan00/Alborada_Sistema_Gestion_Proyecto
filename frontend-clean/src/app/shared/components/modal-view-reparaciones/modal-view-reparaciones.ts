import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReparacionView, ReparacionRequest } from '../../../core/models/reparacion';
import { ReparacionesService } from '../../../core/services/reparaciones/reparaciones-service';
import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import Swal from 'sweetalert2';

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
    nombreCliente: ['', Validators.required],
    estado: ['EN_REPARACION', Validators.required],
    valorManoDeObra: [0, [Validators.required, Validators.min(1)]],
    fechaConfirmada: [''],
    observacion: [''],
    detalles: this.fb.array<FormGroup>([])
  });

  ngOnInit(): void {
    this.getProductos();
  }

  initForm(): void {

    if (this.reparacion) {

      this.detalleFormArray.clear();

      this.reparacion.detalles.forEach(d => {
        const group = this.createDetalleGroup();

        group.patchValue({
          idProducto: d.id,
          cantidad: d.cantidad,
          valorVenta: d.valorVenta
        });

        this.detalleFormArray.push(group);
      });

      this.form.patchValue({
        nombreCliente: this.reparacion.nombreCliente,
        valorManoDeObra: this.reparacion.valorManoDeObra,
        fechaConfirmada: this.reparacion.fechaConfirmada,
        observacion: this.reparacion.observacion
      });

    } else {
      this.addDetalle();
    }

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  // 🔹 FORM ARRAY
  get detalleFormArray(): FormArray<FormGroup> {
    return this.form.get('detalles') as FormArray<FormGroup>;
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
      valorVenta: [0, [Validators.required, Validators.min(1)]]
    });
  }

  // 🔹 PRODUCTOS 
  getProductos(): void {
    this.productoService.getAll().subscribe((data: any) => {
      console.log('DATA PRODUCTOS 👉', data);
      this.productos = data.content;
      this.productosLoaded = true;

      this.initForm();
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

    this.reparacionesService.create(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Reparación creada'
        });

        this.submitted.emit(payload);
        this.closed.emit();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear'
        });
      }
    });
  }

  handleEdit(): void {
    const payload = this.buildPayload(true);

    this.reparacionesService.update(this.reparacion!.id, payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Reparación actualizada'
        });

        this.submitted.emit(payload);
        this.closed.emit();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar'
        });
      }
    });
  }

  handleDelete(): void {
    if (!this.reparacion?.id) return;

    this.reparacionesService.delete(this.reparacion.id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado'
        });

        this.closed.emit();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar'
        });
      }
    });
  }

  handleTerminar(): void {
    if (!this.reparacion?.id) return;

    this.reparacionesService.terminar(this.reparacion.id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Reparación terminada'
        });

        this.closed.emit();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo terminar'
        });
      }
    });
  }

  buildPayload(includeId: boolean = false): any {
    const formValue = this.form.value;
    const payload: any = {
      nombreCliente: formValue.nombreCliente,
      valorManoDeObra: formValue.valorManoDeObra,
      observacion: formValue.observacion,
      detalles: this.detalleFormArray.value.map((d: any) => ({
        id: d.idProducto,
        cantidad: d.cantidad,
        valorVenta: d.valorVenta
      }))
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

  get title(): string {
    switch (this.mode) {
      case 'create':
        return 'Nueva Reparacion';
      case 'view':
        return `Reparación #${this.reparacion?.id}`;
      case 'edit':
        return `Editar reparación #${this.reparacion?.id}`;
      case 'delete':
        return `Editar reparación #${this.reparacion?.id}`;
      default:
        return 'Reparacion';
    }
  }

}
