import { CommonModule } from '@angular/common';
import { PresupuestoRequest, PresupuestoView } from '../../../core/models/presupuesto';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { PresupuestosService } from '../../../core/services/presupuestos/presupuesto-service';
import Swal from 'sweetalert2';
import {
  Component, EventEmitter, inject, Input,
  OnChanges, Output, SimpleChanges, OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-presupuestos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-view-presupuestos.html',
})
export class ModalViewPresupuesto {
  @Input() mode: ModalMode = 'create';
  @Input() presupuesto: PresupuestoView | null = null;

  productos: ProductoView[] = [];
  productosLoaded = false;

  @Output() submitted = new EventEmitter<ModalMode>();
  @Output() closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductoService);
  private presupuestoService = inject(PresupuestosService);
  private cdr = inject(ChangeDetectorRef);


  form = this.fb.group({
    nombreCliente: ['', Validators.required],
    estado: ['Aprodo_Presupuesto', Validators.required],
    valorManoDeObra: [0, [Validators.required, Validators.min(0)]],
    fechaCreacion: ['', Validators.required],
    fechaConfirmada: [''],
    observacion: ['', Validators.required],
    total: [{ value: 0, disabled: true }], // 👈 AGREGAR
    detalles: this.fb.array<FormGroup>([]),
  });

  ngOnInit(): void {
    this.getProductos();

    this.form.valueChanges.subscribe(() => {
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['presupuesto'] || changes['mode']) {
      this.loadForm();
      if (this.presupuesto && this.productosLoaded) {
        this.setDetallesEnFormArray();
      }
    }
  }

  private loadForm(): void {
    // fecha ISO del backend → YYYY-MM-DD para el input date
    const fechaFormateada = this.presupuesto?.fechaCreacion
      ? this.presupuesto.fechaCreacion.substring(0, 10)
      : '';

    this.form.patchValue({
      nombreCliente: this.presupuesto?.nombreCliente ?? '',
      fechaCreacion: fechaFormateada,
      valorManoDeObra: this.presupuesto?.valorManoDeObra ?? null,
      observacion: this.presupuesto?.observacion ?? '',
    });

    this.detallesFormArray.clear();

    if (!this.presupuesto) {
      this.addDetalle();
    }

    if (this.mode === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private setDetallesEnFormArray(): void {
    if (!this.presupuesto) return;

    this.detallesFormArray.clear();

    const productosArray = (this.presupuesto as any).Productos || this.presupuesto.detalles || [];

    productosArray.forEach((p: any) => {
      const idNumerico = Number(p.idProducto);

      this.detallesFormArray.push(
        this.createDetalleGroup(
          idNumerico,           // id
          p.Cantidad || p.cantidad,       // cantidad
          p.PrecioUnitario || p.precioUnitario || p.precioVenta,  // precio
          p.Nombre || p.nombreProducto // nombre para mostrar en view
        )
      );
    });
    if (this.mode === 'view') {
      this.detallesFormArray.disable();
    }

    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  getProductos() {
    this.productService.getAll().subscribe(data => {
      this.productos = (data as any).content;
      this.productosLoaded = true;

      if (this.presupuesto) {
        this.setDetallesEnFormArray();
      }
    });
  }

  onProductoChange(index: number) {
    const detalle = this.detallesFormArray.at(index);
    const id = detalle.get('idProducto')?.value;

    const producto = this.productos.find(p => p.id === id);

    if (producto) {
      detalle.patchValue({
        precioUnitario: producto.precioVenta
      });

    }
  }

  addDetalle(): void {
    this.detallesFormArray.push(this.createDetalleGroup());
  }

  removeDetalle(index: number): void {
    this.detallesFormArray.removeAt(index);
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    switch (this.mode) {
      case 'create': this.handleCreate(); break;
      case 'edit': this.handleEdit(); break;
      case 'delete': this.handleDelete(); break;
    }
  }

  handleCreate(): void {
    const payload = this.buildPayload();
    this.presupuestoService.create(payload).subscribe({
      next: () => {
        this.showSuccess('Presupuesto creado correctamente');
        this.submitted.emit('create');
        this.closed.emit();
      },
      error: () => this.showError(),
    });
  }

  handleEdit(): void {
    const payload = this.buildPayload(true);
    this.presupuestoService.update(this.presupuesto!.id, payload).subscribe({
      next: () => {
        this.showSuccess('Presupuesto editado correctamente');
        this.submitted.emit('edit');
        this.closed.emit();
      },
      error: () => this.showError(),
    });
  }

  handleDelete(): void {
    if (!this.presupuesto?.id) return;
    this.presupuestoService.delete(this.presupuesto.id).subscribe({
      next: () => {
        this.showSuccess('Presupuesto eliminado correctamente');
        this.submitted.emit('delete');
        this.closed.emit();
      },
      error: () => this.showError(),
    });
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

   get totalCalculado(): number {
    const productosTotal = this.detallesFormArray.value.reduce(
      (acc: number, d: any) => acc + (d.precioUnitario || 0) * (d.cantidad || 0),
      0
    );

    const manoDeObra = this.form.value.valorManoDeObra || 0;

    return productosTotal + manoDeObra;
  }


  private buildPayload(includeId = false): PresupuestoRequest {
    const v = this.form.getRawValue();
    const payload: PresupuestoRequest = {
      nombreCliente: v.nombreCliente!,
      estado: v.estado!,
      fechaCreacion: v.fechaCreacion!,
      fechaConfirmada: v.fechaConfirmada!,
      valorManoDeObra: v.valorManoDeObra!,
      observacion: v.observacion ?? '',
      detalles: (v.detalles ?? []).map((d: any) => ({
        idProducto: d.idProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      })),
    };
    return payload;
  }

  showSuccess(message: string): void {
    Swal.fire({ icon: 'success', title: 'OK', text: message, confirmButtonText: 'Aceptar' });
  }

  showError(): void {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un problema', confirmButtonText: 'Aceptar' });
  }

  get title(): string {
    const titles: Record<ModalMode, string> = {
      create: 'Nuevo Presupuesto',
      view: 'Presupuesto',
      edit: 'Editar Presupuesto',
      delete: 'Borrar Presupuesto',
    };
    return titles[this.mode] ?? 'Presupuesto';
  }

  get detallesFormArray(): FormArray<FormGroup> {
    return this.form.get('detalles') as FormArray<FormGroup>;
  }

}
