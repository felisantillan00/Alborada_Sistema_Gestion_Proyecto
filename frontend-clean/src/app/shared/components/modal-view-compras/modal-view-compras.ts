import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompraView, FORMAS_PAGO, FormaPago } from '../../../core/models/compra';
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
  formasPago = FORMAS_PAGO;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductoService);
  private comprasService = inject(ComprasService);
  private cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this.getProductos();
  }

  form = this.fb.group({
    total: [null as number | null, [Validators.required, Validators.min(1)]],
    nombreProveedor: ['', Validators.required],
    fecha: ['', Validators.required],
    formaPago: [null as FormaPago | null, Validators.required],
    Productos: this.fb.array<FormGroup>([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compra'] || changes['mode']) {
      this.loadForm();
      if (this.compra && this.productosLoaded) {
        this.setProductosEnFormArray();
      }
    }
  }

  get productoFormArray(): FormArray<FormGroup> {
    return this.form.get('Productos') as FormArray<FormGroup>;
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
    this.productoFormArray.controls.forEach(group => group.markAllAsTouched());
    this.form.markAllAsTouched();

    console.log('Form válido:', this.form.valid);
    console.log('Form errors:', this.form.errors);
    console.log('Valores:', this.form.getRawValue());
    // ver qué control específico está fallando
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) {
        console.log(`Campo inválido: ${key}`, control.errors);
      }
    });

    if (this.form.invalid) return;

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
    console.log('PAYLOAD COMPRA:', JSON.stringify(payload, null, 2)); // 👈

    this.comprasService.create(payload).subscribe({
      next: () => {
        this.showSuccess('Compra creada correctamente');
        this.closed.emit();
      },
      error: (err) => {
        console.log('ERROR STATUS:', err.status);
        console.log('ERROR BODY:', err.error);
        console.log('ERROR COMPLETO:', JSON.stringify(err.error, null, 2)); // 👈

        this.showError();
      }
    });
  }

  handleEdit(): void {
    const payload = this.buildPayload(true);

    this.comprasService.update(this.compra!.id, payload).subscribe({
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
    if (!this.compra?.id) return;

    this.comprasService.delete(this.compra.id).subscribe({
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
    const raw = this.form.getRawValue();
    const payload: any = {
      nombreProveedor: raw.nombreProveedor,  // 👈 era "proveedor"
      precioTotal: raw.total,
      fecha: raw.fecha,
      formaPago: raw.formaPago,
      detalles: raw.Productos.map((p: any) => ({  // 👈 era "productos"
        idProducto: p.idProducto,                // 👈 era "id"
        cantidad: p.cantidad,
      }))
    };

    if (includeId) {
      payload.id = this.compra?.id;
    }

    return payload;
  }

  getProductos(): void {
    this.productService.getAll().subscribe(data => {
      this.productos = Array.isArray(data) ? data : (data as any).content || [];
      this.productosLoaded = true;

      if (this.compra) {
        this.setProductosEnFormArray();
      }
    });
  }

  get productosControls(): FormGroup[] {
    return this.productoFormArray.controls as FormGroup[];
  }

  private setProductosEnFormArray(): void {
    if (!this.compra?.Productos) return;

    this.productoFormArray.clear();

    this.compra.Productos.forEach((producto) => {
      const idNumerico = producto.id ? Number(producto.id) : null;

      this.productoFormArray.push(
        this.createProductoGroup(
          idNumerico,
          producto.Cantidad,
          producto.Precio,
          producto.Nombre
        )
      );
    });

    if (this.mode === 'view') {
      this.productoFormArray.disable();
    }

    this.cdr.detectChanges();
  }

  private loadForm(): void {
    //normalizo
    const formaPagoNormalizada = this.compra?.formaPago ? (this.compra.formaPago.trim().toLocaleUpperCase() as FormaPago) : null
    this.form.patchValue({
      total: this.compra?.total ?? 0,
      nombreProveedor: this.compra?.nombreProveedor ?? '',
      fecha: this.compra?.fecha ?? '',
      formaPago: formaPagoNormalizada,
    });

    this.productoFormArray.clear();

    if (!this.compra) {
      this.addProducto();
    }

    if (this.mode === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private createProductoGroup(
    id: number | string | null = null,
    cantidad: number | null = null,
    precioCompra: number | null = null,
    nombre: string = ''
  ): FormGroup {
    return this.fb.group({
      idProducto: [id, Validators.required],
      nombre: [nombre],
      cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      precioCompra: [precioCompra],
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