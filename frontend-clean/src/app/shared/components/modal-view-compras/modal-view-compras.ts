import { CommonModule } from '@angular/common';
import { ProveedoresService } from '../../../core/services/proveedores/proveedores-service';
import { Proveedor } from '../../../core/models/proveedor';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompraView, FORMAS_PAGO, FormaPago } from '../../../core/models/compra';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { ComprasService } from '../../../core/services/compras/compras-service';
import { ProductoView } from '../../../core/models/producto';
import Swal from 'sweetalert2';

type ModalMode = 'create' | 'view' | 'edit';



@Component({
  selector: 'app-modal-view-compras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-view-compras.html',
})
export class ModalViewCompras implements OnChanges, OnInit {
  @Input() mode: ModalMode = 'create';
  @Input() compra: CompraView | null = null;

  productos: ProductoView[] = [];
  productosLoaded = false;
  formasPago = FORMAS_PAGO;
  totalCalculado: number = 0;

  proveedores: Proveedor[] = [];
  private proveedoresService = inject(ProveedoresService);


  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductoService);
  private comprasService = inject(ComprasService);
  private cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this.getProductos();
    this.form.valueChanges.subscribe(() => {
      this.recalcularTotal();
    })
    this.getProveedores();
  }

  form = this.fb.group({
    nombreProveedor: ['', Validators.required],
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
    }
  }

  onProductoChange(index: number): void {
    const grupo = this.productoFormArray.at(index);
    const id = grupo.get('idProducto')?.value;
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
      grupo.patchValue({ precioCompra: producto.precioCosto });
      this.recalcularTotal();
    }
  }

  handleCreate(): void {
    const payload = this.buildPayload();
    console.log('PAYLOAD COMPRA:', JSON.stringify(payload, null, 2)); // 👈

    this.comprasService.create(payload).subscribe({
      next: () => {
        this.submitted.emit('create');
        this.showSuccess('Compra creada correctamente');
        this.closed.emit();
      },
      error: (err) => {
        console.log('ERROR STATUS:', err.status);
        console.log('ERROR COMPLETO:', JSON.stringify(err.error, null, 2));

        //logica para traer el error de spring
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';

        this.showError(errorMensaje);
      }
    });
  }

  handleEdit(): void {
    const payload = this.buildPayload(true);

    this.comprasService.update(this.compra!.id, payload).subscribe({
      next: () => {
        this.submitted.emit('edit');
        this.showSuccess('Compra editada correctamente');
        this.closed.emit();
      },
      error: (err) => {
        //logica para traer el error de spring
        const errorMensaje = err?.error?.message || (typeof err.error === 'string' ? err.error : 'null') || 'Ocurrio un error';
        this.showError(errorMensaje);
      }
    });
  }



  buildPayload(includeId: boolean = false): any {
    const raw = this.form.getRawValue();
    const payload: any = {
      idProveedor: raw.nombreProveedor,   // el form guarda el id del proveedor
      formaPago: raw.formaPago,
      detalles: raw.Productos.map((p: any) => ({
        idProducto: p.idProducto,
        cantidad: p.cantidad,
        precioCompra: p.precioCompra,     // incluir el precio
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

  getProveedores(): void {
    this.proveedoresService.getAll().subscribe(data => {
      this.proveedores = Array.isArray(data) ? data : (data as any).content || [];
    });
  }

  private recalcularTotal(): void {
    this.totalCalculado = this.productoFormArray.controls.reduce((sum, group) => {
      const cantidad = Number(group.get('cantidad')?.value) || 0;
      const precio = Number(group.get('precioCompra')?.value) || 0;
      return sum + cantidad * precio;
    }, 0);
  }

  private setProductosEnFormArray(): void {
    if (!this.compra?.productos) return;

    this.productoFormArray.clear();

    this.compra.productos.forEach((producto) => {
      const idNumerico = producto.id ? Number(producto.id) : null;

      this.productoFormArray.push(
        this.createProductoGroup(
          idNumerico,
          producto.Cantidad,
          producto.Precio,
          producto.nombre
        )
      );
    });

    if (this.mode === 'view') {
      this.productoFormArray.disable();
    }

    this.cdr.detectChanges();
    this.recalcularTotal();

  }

  private loadForm(): void {
    //normalizo
    const formaPagoNormalizada = this.compra?.formaPago ? (this.compra.formaPago.trim().toLocaleUpperCase() as FormaPago) : null
    this.form.patchValue({
      nombreProveedor: this.compra?.proveedorNombre ?? '',
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
  showError(mensaje: string = "Ocurrio un error"): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
    });
  }
}