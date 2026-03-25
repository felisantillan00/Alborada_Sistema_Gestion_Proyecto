import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import { Pagina } from '../../../core/models/pagina';
import { VentaView } from '../../../core/models/venta';
import { VentasService } from '../../../core/services/ventas/ventas-service';
import { ModalViewVentas } from '../../../shared/components/modal-view-ventas/modal-view-ventas';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalViewVentas],
  templateUrl: './ventas.html',
})
export class Ventas implements OnInit {
  ventas: VentaView[] = [];
  loadingVentas = false;

  modalOpen = false;
  modalMode: ModalMode = 'create';
  selectedVenta: VentaView | null = null;

  readonly defaultColDef: ColDef<VentaView> = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  readonly columnDefs: ColDef<VentaView>[] = [
    { field: 'Id', headerName: 'ID', maxWidth: 120 },
    { field: 'NombreCliente', headerName: 'Cliente', minWidth: 200 },
    { field: 'PrecioTotal', headerName: 'Precio Total' },
    { field: 'Fecha', headerName: 'Fecha' },
    { field: 'FormaDePago', headerName: 'Forma de Pago' },
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

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.getVentas();
  }

  getVentas(): void {
    this.loadingVentas = true;

    this.ventasService
      .getPage()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener ventas:', error);
          this.loadingVentas = false;

          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0
          } as Pagina<VentaView>);
        })
      )
      .subscribe((data) => {
        this.ventas = data.content;
        this.loadingVentas = false;
      });
  }

  onNewVenta(): void {
    this.openModal('create', null);
  }

  onRowClicked(event: RowClickedEvent<VentaView>): void {
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
    this.selectedVenta = null;
    this.modalMode = 'create';
  }

  onModalSubmit(mode: ModalMode): void {
    // Placeholder for create/edit/delete integration.
    console.log(`Modal submit action: ${mode}`);
    this.closeModal();
  }

  private openModal(mode: ModalMode, venta: VentaView | null): void {
    this.modalMode = mode;
    this.selectedVenta = venta;
    this.modalOpen = true;
  }
}
