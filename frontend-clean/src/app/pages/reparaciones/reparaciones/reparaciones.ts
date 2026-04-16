import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReparacionView } from '../../../core/models/reparacion';
import { ReparacionesService } from '../../../core/services/reparaciones/reparaciones-service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
import { ModalViewReparaciones } from '../../../shared/components/modal-view-reparaciones/modal-view-reparaciones';
import { catchError, of } from 'rxjs';
import { Pagina } from '../../../core/models/pagina';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';
type ReparacionEstado = 'all' | 'Pendiente_Aprobacion' | 'Aprobado_Presupuesto' | 'Finalizado';


@Component({
  selector: 'app-reparaciones',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalViewReparaciones],
  templateUrl: './reparaciones.html',
  styleUrl: './reparaciones.css',
})
export class Reparaciones implements OnInit {
  searchText: string = '';
  private gridApi!: GridApi;
  isSearchExpanded = false;
  @ViewChild('searchInput') searchInput!: ElementRef;

  currentFilter: ReparacionEstado = 'all';

  reparaciones: ReparacionView[] = [];
  loadingReparaciones = false;

  modalOpen = false;
  modalMode: ModalMode = 'create';
  selectedReparacion: ReparacionView | null = null;

  totalElements = 0;
  totalPages = 0;
  number = 0;

  readonly defaultColDef: ColDef<ReparacionView> = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  readonly columnDefs: ColDef<ReparacionView>[] = [
    // { field: 'id', headerName: 'ID', maxWidth: 100 },
    { field: 'nombreCliente', headerName: 'Cliente' },
    {
      field: 'valorTotal',
      headerName: 'Precio Total',
      valueFormatter: (params) => {
        return params.value != null ? '$ ' + params.value : '';
      }
    },
    { field: 'valorManoDeObra', headerName: 'Mano de Obra' },
    { field: 'fechaConfirmada', headerName: 'Fecha' },
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
            texto = 'En reparación';              // ← ahora es reparación
            color = 'warning';
            break;
          case 'Finalizado':
            texto = 'Finalizado';
            color = 'success';
            break;
          default:
            texto = estado;
            color = 'secondary';
        }
        return `<span class="badge bg-${color} ${claseExtra}">${texto}</span>`;
      }
    },


    {
      headerName: 'Actions',
      colId: 'actions',
      sortable: false,
      filter: false,
      maxWidth: 150,
      cellRenderer: () => `
        <div class="d-flex gap-2 justify-content-center h-100 align-items-center">
      <button type="button" class="btn btn-sm btn-outline-primary" data-action="view" title="Ver">
        <i class="bi bi-eye"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit" title="Editar">
        <i class="bi bi-pencil"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" title="Eliminar">
        <i class="bi bi-trash"></i>
      </button>
    </div>
      `,
    },
  ];

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
          } as Pagina<ReparacionView>);
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

  getRowId = (params: any) => params.data.id.toString();

  onRowClicked(event: RowClickedEvent<ReparacionView>): void {
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

  // ==================== FILTRO ====================
  applyFilter(filterType: ReparacionEstado) {
    this.currentFilter = filterType;
    if (this.gridApi) this.gridApi.onFilterChanged();
  }

  clearFiltersAndSort() {
    this.applySort('', null);
    this.applyFilter('all');
  }

  isExternalFilterPresent = (): boolean => this.currentFilter !== 'all';

  doesExternalFilterPass = (node: any): boolean => {
    if (this.currentFilter === 'all') return true;
    return node.data?.estado === this.currentFilter;
  };

  onSearchInput(event: any) {
    this.searchText = event.target.value;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', this.searchText);
    }
  }

  toggleSearch() {
    if (this.isSearchExpanded && this.searchText) {
      this.searchText = '';
      if (this.gridApi) {
        this.gridApi.setGridOption('quickFilterText', '')
      }
      this.isSearchExpanded = false;
    } else {
      this.isSearchExpanded = !this.isSearchExpanded;
      if (this.isSearchExpanded) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus(), 300
        });
      }
    }
  }

  applySort(colId: string, sortDirection: 'asc' | 'desc' | null) {
    if (!this.gridApi) return;
    // Si pasamos null, limpia el orden. Si pasamos asc/desc, lo aplica a esa columna
    const state = sortDirection ? [{ colId: colId, sort: sortDirection }] : [];

    this.gridApi.applyColumnState({
      state: state,
      defaultState: { sort: null } // Esto asegura que se limpie el orden de las demás columnas
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onNewReparacion(): void {
    this.openModal('create', null);
  }

  private openModal(mode: ModalMode, reparacion: ReparacionView | null): void {
    this.modalMode = mode;
    this.selectedReparacion = reparacion;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedReparacion = null;
    this.modalMode = 'create';
  }

  onModalSubmit(mode: ModalMode): void {
    this.closeModal();
    this.getReparaciones();
  }

  getRowClass = (params: any) => {
    if (params.data.estado === 'Finalizado') {
      return 'fila-terminada';
    }
    return '';
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkResponsiveColumns(event.target.innerWidth);
  }
  private checkResponsiveColumns(width: number) {
    if (!this.gridApi) return;

    //si el tamaño es de celular, oculto columnas no tan importantes
    if (width < 768) {
      this.gridApi.setColumnsVisible(['valorManoDeObra', 'fechaConfirmada'], false)
    } else {
      this.gridApi.setColumnsVisible(['valorManoDeObra', 'fechaConfirmada'], true)
    }
    //hago que el tamaño de las columnas se ajuste al nuevo tamaño de la pantalla
    this.gridApi.sizeColumnsToFit();
  }

}