import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PresupuestosService } from '../../core/services/presupuestos/presupuesto-service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
import { catchError, of } from 'rxjs';
import { Pagina } from '../../core/models/pagina';
import { PresupuestoView } from '../../core/models/presupuesto';
import { CommonModule } from '@angular/common';
import { ModalViewPresupuesto } from '../../shared/components/modal-view-presupuestos/modal-view-presupuestos';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalViewPresupuesto],
  templateUrl: './presupuestos.html',
  styleUrl: './presupuestos.css',
})
export class Presupuestos implements OnInit {
  private gridApi!: GridApi;
  searchText: string = '';
  isSearchExpanded = false;
  @ViewChild('searchInput') searchInput!: ElementRef;

  presupuestos: PresupuestoView[] = [];
  loadingPresupuestos = false;

  modalOpen = false;
  modalMode: ModalMode = 'create';
  selectedPresupuesto: PresupuestoView | null = null;

  totalElements = 0;
  totalPages = 0;
  number = 0;

  readonly defaultColDef: ColDef<PresupuestoView> = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  readonly columnDefs: ColDef<PresupuestoView>[] = [
    { field: 'nombreCliente', headerName: 'Cliente' },

    {
      field: 'valorTotal',
      headerName: 'Precio Total',
      valueFormatter: (params) => {
        return params.value != null ? '$ ' + params.value : '';
      }
    },
    { field: 'valorManoDeObra', headerName: 'Mano de Obra' },
    { field: 'observacion', headerName: 'Descripción' },
    { field: 'fechaCreacion', headerName: 'Fecha' },
    {
      field: 'estado',
      headerName: 'Estado',
      cellRenderer: (params: any) => {
        const estado = params.value;
        let texto = '';
        let color = '';
        let claseExtra = 'fs-6 fw-bold';

        switch (estado) {
          case 'Pendiente_Aprobacion':
            texto = 'Pendiente de aprobación';   // presupuesto
            color = 'warning';
            break;
          case 'Aprobado_Presupuesto':
            texto = 'Aprobado';   // presupuesto
            color = 'success';
            break;
          case 'Rechazado':
            texto = 'Rechazado';   // presupuesto
            color = 'danger';
            break;
          default:
            texto = estado;
            color = 'secondary';
        }

        return `<span class="badge bg-${color} ${claseExtra}">${texto}</span>`;
      }
    },
    { field: 'fechaConfirmada', headerName: 'Fecha Entrega' },

    {
      headerName: 'Actions',
      colId: 'actions',
      sortable: false,
      filter: false,
      maxWidth: 180,
      cellRenderer: () => `
        <div class="d-flex gap-2 justify-content-center h-100 align-items-center">
          <button class="btn btn-sm btn-outline-primary" data-action="view">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary" data-action="edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete">
            <i class="bi bi-trash"></i>
          </button>
          <button class="btn btn-sm btn-outline-success" data-action="aprobado">
            <i class="bi bi-check"></i>
          </button>
        </div>
      `
    }
  ];

  constructor(
    private presupuestosService: PresupuestosService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getPresupuestos();
  }

  getPresupuestos(): void {
    this.loadingPresupuestos = true;
    this.presupuestosService.getPage()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener presupuestos:', error);
          this.loadingPresupuestos = false;

          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0
          } as Pagina<PresupuestoView>);
        })
      )
      .subscribe((data) => {
        this.presupuestos = [...data.content];
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.number = data.number;
        this.cdr.detectChanges();
        this.loadingPresupuestos = false;
      });

  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  toggleSearch(): void {
    this.isSearchExpanded = !this.isSearchExpanded;
    if (this.isSearchExpanded) {
      setTimeout(() => this.searchInput.nativeElement.focus(), 0);
    } else {
      this.searchText = '';
      this.gridApi.setGridOption('quickFilterText', '');
    }
  }

  onSearchChange(): void {
    this.gridApi.setGridOption('quickFilterText', this.searchText);
  }

  getRowId = (params: any) => params.data.id.toString();
  
  onRowClicked(event: RowClickedEvent<PresupuestoView>): void {
    const target = event.event?.target as HTMLElement | null;
    const action = target?.closest('[data-action]')?.getAttribute('data-action');

    if (!action || !event.data) return;

    switch (action) {
      case 'view':
        this.openModal('view', event.data);
        break;
      case 'edit':
        this.openModal('edit', event.data);
        break;
      case 'delete':
        this.openModal('delete', event.data);
        break;
      case 'aprobado':
        this.aprobarPresupuesto(event.data.id);
        break;
    }
  }

  aprobarPresupuesto(id: number): void {
    this.presupuestosService.aprobar(id).subscribe(() => {
      this.getPresupuestos();
    });
  }

  onNewPresupuesto(): void {
    this.openModal('create', null);
  }

  private openModal(mode: ModalMode, presupuesto: PresupuestoView | null): void {
    this.modalMode = mode;
    this.selectedPresupuesto = presupuesto;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedPresupuesto = null;
    this.modalMode = 'create';
  }

  onModalSubmit(mode: ModalMode): void {
    this.closeModal();
    this.getPresupuestos();
  }


}
