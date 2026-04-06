import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReparacionView } from '../../../core/models/reparacion';
import { ReparacionesService } from '../../../core/services/reparaciones/reparaciones-service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
import { ModalViewReparaciones } from '../../../shared/components/modal-view-reparaciones/modal-view-reparaciones';
import { catchError, of } from 'rxjs';



@Component({
  selector: 'app-reparaciones',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalViewReparaciones],
  templateUrl: './reparaciones.html',
})
export class Reparaciones implements OnInit {

  reparaciones: ReparacionView[] = [];
  searchText: string = '';
  private gridApi!: GridApi;
  loadingReparaciones = false;

  totalElements = 0;
  totalPages = 0;
  number = 0;

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
      cellRenderer: (params: any) => {
        const disabled = params.data.estadoReparacion === 'TERMINADO';

        return `
          <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-sm btn-outline-primary" data-action="view">
              <i class="bi bi-eye"></i>
            </button>

            <button class="btn btn-sm btn-outline-secondary" data-action="edit" ${disabled ? 'disabled' : ''}>
              <i class="bi bi-pencil"></i>
            </button>

            <button class="btn btn-sm btn-outline-danger" data-action="delete" ${disabled ? 'disabled' : ''}>
              <i class="bi bi-trash"></i>
            </button>

            <button class="btn btn-sm btn-outline-success" data-action="terminar" ${disabled ? 'disabled' : ''}>
              <i class="bi bi-check-lg"></i>
            </button>
          </div>
        `;
      }
  }  ];

  constructor(private reparacionesService: ReparacionesService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getReparaciones();
  }

  getReparaciones(): void {
    this.loadingReparaciones = true;

    this.reparacionesService
      .getPage()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener reparaciones:', error);
          this.loadingReparaciones = false;

          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0
          });
        })
      )
      .subscribe((data) => {
        this.reparaciones = [...data.content];
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.number = data.number;

        this.loadingReparaciones = false;
        this.cdr.detectChanges();
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

  modalOpen = false;
  modalMode: 'create' | 'view' | 'edit' | 'delete' = 'create';
  selectedReparacion: ReparacionView | null = null;

  onNewReparacion(): void {
    this.modalOpen = true;
    this.modalMode = 'create';
  }



  private openModal(mode: any, reparacion: ReparacionView | null): void {
    this.modalMode = mode;
    this.selectedReparacion = reparacion;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedReparacion = null;
  }

  onModalSubmit(data: any): void {
    console.log('DATA FORM', data);

    // después lo conectamos con backend
    this.closeModal();
    this.getReparaciones();
  }

  getRowClass = (params: any) => {
    if (params.data.estadoReparacion === 'TERMINADO') {
      return 'fila-terminada';
    }
    return '';
  };
}