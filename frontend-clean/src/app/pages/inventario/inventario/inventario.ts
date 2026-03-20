import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowClickedEvent } from 'ag-grid-community';

import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { ModalView } from '../../../shared/components/modal-view/modal-view';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalView],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {

  productos: ProductoView[] = [];
  loadingProductos = false;

  modalOpen = false;
  modalMode: ModalMode = 'create';
  selectedProducto: ProductoView | null = null;

  readonly defaultColDef: ColDef<ProductoView> = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  readonly columnDefs: ColDef<ProductoView>[] = [
    { field: 'id', headerName: 'ID', maxWidth: 110 },
    { field: 'nombre', headerName: 'Nombre', minWidth: 200 },
    { field: 'precioCompra', headerName: 'Precio Compra' },
    { field: 'precioVenta', headerName: 'Precio Venta' },
    { field: 'stock', headerName: 'Stock', maxWidth: 120 },
    { field: 'nombreProveedor', headerName: 'Proveedor' },
    { field: 'nombreCategoria', headerName: 'Categoria' },
    { field: 'nombreMarca', headerName: 'Marca' },
    {
      headerName: 'Actions',
      colId: 'actions',
      sortable: false,
      filter: false,
      maxWidth: 190,
      cellRenderer: () => `
        <div class="d-flex gap-2 justify-content-center h-100 align-items-center">
          <button type="button" class="btn btn-sm btn-outline-primary" data-action="view">View</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit">Edit</button>
        </div>
      `,
    },
  ];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
      this.getProductos();
  }

  getProductos(): void {
    this.loadingProductos = true;

    this.productoService
      .getAll()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener productos:', error);
          this.loadingProductos = false;
          return of([] as ProductoView[]);
        })
      )
      .subscribe((data) => {
        this.productos = data;
        this.loadingProductos = false;
        console.log(this.productos)
      });
  }

  onNewProduct(): void {
    this.openModal('create', null);
  }

  onRowClicked(event: RowClickedEvent<ProductoView>): void {
    const target = event.event?.target as HTMLElement | null;
    const action = target?.closest('[data-action]')?.getAttribute('data-action');

    if (!action || !event.data) {
      return;
    }

    if (action === 'view' || action === 'edit') {
      this.openModal(action, event.data);
    }
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedProducto = null;
    this.modalMode = 'create';
  }

  onModalSubmit(mode: ModalMode): void {
    // Placeholder for create/edit/delete integration.
    console.log(`Modal submit action: ${mode}`);
    this.closeModal();
  }

  private openModal(mode: ModalMode, product: ProductoView | null): void {
    this.modalMode = mode;
    this.selectedProducto = product;
    this.modalOpen = true;
  }
}
