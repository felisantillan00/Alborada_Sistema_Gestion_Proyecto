import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReparacionView } from '../../../core/models/reparacion';
import { ReparacionesService } from '../../../core/services/reparaciones/reparaciones-service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
import { Pagina } from '../../../core/models/pagina';



@Component({
  selector: 'app-reparaciones',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './reparaciones.html',
})
export class Reparaciones {

  onNewReparacion(): void {
    console.log('Nueva reparación');
  }

  reparaciones: ReparacionView[] = [];
  searchText: string = '';
  private gridApi!: GridApi;

  readonly defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };
  
  readonly columnDefs: ColDef<ReparacionView>[] = [
    { field: 'id', headerName: 'ID', maxWidth: 100 },
    { field: 'estadoReparacion', headerName: 'Estado' },
    { field: 'valorTotal', headerName: 'Total' },
    { field: 'valorManoDeObra', headerName: 'Mano de Obra' },
    { field: 'fechaConfirmada', headerName: 'Fecha' },

    {
      headerName: 'Acciones',
      colId: 'actions',
      maxWidth: 200,
      cellRenderer: () => `
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn btn-sm btn-outline-primary" data-action="view">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary" data-action="edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete">
          <i class="bi bi-trash"></i>
        </button>
        <button class="btn btn-sm btn-outline-success" data-action="terminar">
          <i class="bi bi-check-lg"></i>
        </button>
      </div>
    `
    }
  ];

  constructor(private reparacionesService: ReparacionesService) { }

  ngOnInit(): void {
    this.getReparaciones();
  }

  getReparaciones(): void {
    this.reparacionesService.getPage().subscribe(res => {
      this.reparaciones = res.content;
    });
  }

  onRowClicked(event: RowClickedEvent<ReparacionView>): void {
    const action = (event.event?.target as HTMLElement)
      ?.closest('[data-action]')
      ?.getAttribute('data-action');

    if (!action || !event.data) return;

    switch (action) {
      case 'view':
        console.log('VER', event.data);
        break;

      case 'edit':
        console.log('EDIT', event.data);
        break;

      case 'delete':
        console.log('DELETE', event.data);
        break;

      case 'terminar':
        this.terminarReparacion(event.data.id);
        break;
    }
  }

  terminarReparacion(id: number): void {
    this.reparacionesService.terminar(id).subscribe(() => {
      this.getReparaciones(); // 🔥 refresca tabla
    });
  }

  onSearchInput(event: any) {
    this.searchText = event.target.value;

    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', this.searchText);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


}