import { CommonModule } from '@angular/common';
import { PresupuestoRequest, PresupuestoView } from '../../../core/models/presupuesto';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { PresupuestosService } from '../../../core/services/presupuestos/presupuesto-service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  Component, EventEmitter, inject, Input,
  OnChanges, Output, SimpleChanges, OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { color } from 'chart.js/helpers';

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
    estado: ['Pendiente_Aprobacion', Validators.required],
    valorManoDeObra: [0, [Validators.required, Validators.min(0)]],
    observacion: ['', Validators.required],
    total: [{ value: 0, disabled: true }],
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
      const idProducto = Number(p.id);

      this.detallesFormArray.push(
        this.createDetalleGroup(
          idProducto,           // id
          p.Cantidad || p.cantidad,       // cantidad
          p.ValorVenta || p.valorVenta || p.precioVenta,  // precio
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
        valorVenta: producto.precioVenta
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
    console.log('CLICK SUBMIT');
    console.log('FORM INVALID?', this.form.invalid);
    console.log('FORM VALUE', this.form.value);

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
    console.log('PAYLOAD >>>', payload);

    this.presupuestoService.create(payload).subscribe({
      next: () => {
        this.showSuccess('Presupuesto creado correctamente');
        this.submitted.emit('create');
        this.closed.emit();
      },
      error: (err) => {
        console.error('ERROR BACK >>>', err);
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';
        this.showError(errorMensaje);
      },
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
      error: (err) => {
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';
        this.showError(errorMensaje);
      }
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
      error: (err) => {
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';
        this.showError(errorMensaje);
      }
    });
  }


  private createDetalleGroup(
    id: number | null = null,
    cantidad: number | null = null,
    valorVenta: number | null = null,
    nombre: string = ''
  ): FormGroup {
    return this.fb.group({
      idProducto: [id, [Validators.required, Validators.min(1)]],
      nombre: [nombre], // solo para mostrar en view, no se envía al backend
      cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      valorVenta: [valorVenta, [Validators.required, Validators.min(1)]],   // solo lectura en view/edit
    });
  }

  get totalCalculado(): number {
    const productosTotal = this.detallesFormArray.value.reduce(
      (acc: number, d: any) => acc + (d.valorVenta || 0) * (d.cantidad || 0),
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
      valorManoDeObra: v.valorManoDeObra!,
      observacion: v.observacion ?? '',

      detalles: (v.detalles ?? []).map((d: any) => ({
        id: Number(d.idProducto),
        cantidad: Number(d.cantidad),
        valorVenta: Number(d.valorVenta),
      })),
    };

    return payload;
  }

  showSuccess(message: string): void {
    Swal.fire({ icon: 'success', title: 'OK', text: message, confirmButtonText: 'Aceptar' });
  }

  private showError(mensaje: string = 'ocurrió un error'): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
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

  
  generarComprobante(): void {

  if (!this.presupuesto) return;

  const doc = new jsPDF();

  // FECHA FORMATEADA
  const fecha = this.presupuesto.fechaCreacion
    ? new Date(this.presupuesto.fechaCreacion).toLocaleDateString('es-AR')
    : new Date().toLocaleDateString('es-AR');

  // TITULO
  doc.setFontSize(22);
  doc.text('COMPROBANTE DE PRESUPUESTO', 105, 20, { align: 'center' });

  // Línea decorativa
  doc.line(10, 28, 200, 28);

  // DATOS CLIENTE
  doc.setFontSize(12);

  doc.text(
    `Cliente: ${this.presupuesto.nombreCliente}`,
    14,
    40
  );

  doc.text(
    `Fecha: ${fecha}`,
    14,
    48
  );

  // TABLA PRODUCTOS
  autoTable(doc, {
    startY: 60,
    head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],

    body: this.presupuesto.detalles.map((d: any) => [
      d.nombreProducto || d.Nombre || 'Producto',
      d.cantidad || d.Cantidad,
      `$${d.valorVenta || d.ValorVenta}`,
      `$${(d.valorVenta || d.ValorVenta) * (d.cantidad || d.Cantidad)}`
    ])
  });

  // POSICION FINAL TABLA
  const finalY = (doc as any).lastAutoTable.finalY + 15;

  // MANO DE OBRA
  doc.setFontSize(12);

  doc.text(
    `Mano de obra: $${this.presupuesto.valorManoDeObra}`,
    14,
    finalY
  );

  // TOTAL
  doc.setFontSize(16);

  doc.text(
    `TOTAL: $${this.totalCalculado}`,
    14,
    finalY + 12
  );

  // OBSERVACION
  if (this.presupuesto.observacion) {

    doc.setFontSize(11);

    doc.text(
      `Observación: ${this.presupuesto.observacion}`,
      14,
      finalY + 28
    );
  }

  // FIRMA
  doc.setFontSize(11);

  doc.text(
    'Firma:',
    14,
    finalY + 50
  );

  doc.line(
    35,
    finalY + 50,
    100,
    finalY + 50
  );

  // DESCARGA
  doc.save(`presupuesto-${this.presupuesto.id}.pdf`);
}
}
