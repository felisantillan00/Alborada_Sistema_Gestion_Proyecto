import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowClickedEvent } from 'ag-grid-community';

import { Pagina } from '../../../core/models/pagina';
import { CompraView } from '../../../core/models/compra';
import { ComprasService } from '../../../core/services/compras/compras-service';
import { ModalViewCompras } from '../../../shared/components/modal-view-compras/modal-view-compras';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalViewCompras],
  templateUrl: './compras.html',
})
export class Compras implements OnInit {
  compras: CompraView[] = [];
  loadingCompras = false;

  modalOpen = false;
  modalMode: ModalMode = 'create';
  selectedCompra: CompraView | null = null;

  readonly defaultColDef: ColDef<CompraView> = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  readonly columnDefs: ColDef<CompraView>[] = [
    { field: 'Id', headerName: 'ID', maxWidth: 120 },
    { field: 'PrecioTotal', headerName: 'Precio Total' },
    { field: 'NombreProveedor', headerName: 'Proveedor', minWidth: 200 },
    { field: 'Fecha', headerName: 'Fecha' },
    {
      headerName: 'Actions',
      colId: 'actions',
      sortable: false,
      filter: false,
      maxWidth: 190,
      cellRenderer: () => `
        <div class="d-flex gap-2 justify-content-center h-100 align-items-center">
          <button type="button" class="btn btn-sm btn-outline-primary" data-action="view">Ver</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit">Editar</button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete">Eliminar</button>
        </div>
      `,
    },
  ];

  constructor(private comprasService: ComprasService) {}

  ngOnInit(): void {
    this.getCompras();
  }

  getCompras(): void {
    this.loadingCompras = true;

    this.comprasService
      .getPage()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener compras:', error);
          this.loadingCompras = false;

          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0
          } as Pagina<CompraView>);
        })
      )
      .subscribe((data) => {
        this.compras = data.content;
        this.loadingCompras = false;
      });
  }

  onNewCompra(): void {
    this.openModal('create', null);
  }

  onRowClicked(event: RowClickedEvent<CompraView>): void {
    const target = event.event?.target as HTMLElement | null;
    const action = target?.closest('[data-action]')?.getAttribute('data-action');

    if (!action || !event.data) {
      return;
    }

    if (action === 'view' || action === 'edit' || action === 'delete') {
      this.openModal(action, event.data);
    }
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedCompra = null;
    this.modalMode = 'create';
  }

  onModalSubmit(mode: ModalMode): void {
    // Placeholder for create/edit/delete integration.
    console.log(`Modal submit action: ${mode}`);
    this.closeModal();
  }

  private openModal(mode: ModalMode, compra: CompraView | null): void {
    this.modalMode = mode;
    this.selectedCompra = compra;
    this.modalOpen = true;
  }
}
