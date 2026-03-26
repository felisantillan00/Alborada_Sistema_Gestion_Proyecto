import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaView } from '../../../core/models/venta';

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

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();
  private fb = inject(FormBuilder);
  private productService = inject(ProductoService);

  ngOnInit(): void {
    this.getProductos();
  }

  form = this.fb.group({
    Id: ['', Validators.required],
    NombreCliente: ['', Validators.required],
    PrecioTotal: [0, Validators.required],
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

  getProductos(): void {
    this.productService.getAll().subscribe(data => {
      this.productos = data;
    });
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
      Id: [id, Validators.required],
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
}
