import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PresupuestosService } from '../../core/services/presupuestos/presupuesto-service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent } from 'ag-grid-community';
import { catchError, of } from 'rxjs';
import { Pagina } from '../../core/models/pagina';
import { PresupuestoView } from '../../core/models/presupuesto';
import { CommonModule } from '@angular/common';
import { ModalViewPresupuesto } from '../../shared/components/modal-view-presupuestos/modal-view-presupuestos';
import Swal from 'sweetalert2';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

type PresupuestoEstado = 'all' | 'Pendiente_Aprobacion' | 'Aprobado_Presupuesto' | 'Rechazado';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalViewPresupuesto],
  templateUrl: './presupuestos.html',
  styleUrl: './presupuestos.css',
})
export class Presupuestos implements OnInit {
  cantidadActual: number = 100;
  private gridApi!: GridApi;
  searchText: string = '';
  isSearchExpanded = false;
  @ViewChild('searchInput') searchInput!: ElementRef;

  //Variable para trackear el filtro actual
  currentFilter: PresupuestoEstado = 'all';

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
    // { field: 'observacion', headerName: 'Descripción' },
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
    // { field: 'fechaConfirmada', headerName: 'Fecha Entrega' },

    {
      headerName: 'Actions',
      colId: 'actions',
      sortable: false,
      filter: false,
      maxWidth: 180,
      cellRenderer: (params: any) => {
        const estado = params.data?.estado;
        const isDisabled = (estado === 'Aprobado_Presupuesto' || estado === 'Rechazado') ? 'disabled' : '';

        return `
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
    this.presupuestosService.getPage({cantidad: this.cantidadActual})
      .pipe(
        catchError((error) => {
          console.error('Error al obtener presupuestos:', error);
          this.loadingPresupuestos = false;

          // Manejo de errores visual para el Grid
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudieron cargar los presupuestos. Verifique la conexión al servidor.'
          });

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

  cargarMas(): void {
    const LIMITE = 1000
    if(this.cantidadActual >= LIMITE){
      alert(`Has alcanzado el límite de ${LIMITE} de items. No se pueden cargar más.`);
      return;
    }
    this.cantidadActual = Math.min(this.cantidadActual + 100, LIMITE); // Incrementa la cantidad actual en 100
    this.getPresupuestos(); // Vuelve a cargar los productos con la nueva cantidad
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    this.gridApi.sizeColumnsToFit();
    this.checkResponsiveColumns(window.innerWidth);
  }

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
        this.gridApi.setGridOption('quickFilterText', '');
      }
      this.isSearchExpanded = false;
    } else {
      this.isSearchExpanded = !this.isSearchExpanded;
      if (this.isSearchExpanded) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 300);
      }
    }
  }

  // ==================== FILTRO Y ORDENAMIENTO ====================
  applyFilter(filterType: PresupuestoEstado) {
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

  applySort(colId: string, sortDirection: 'asc' | 'desc' | null) {
    if (!this.gridApi) return;
    const state = sortDirection ? [{ colId: colId, sort: sortDirection }] : [];

    this.gridApi.applyColumnState({
      state: state,
      defaultState: { sort: null }
    });
  }

  getRowId = (params: any) => params.data.id.toString();

  onRowClicked(event: RowClickedEvent<PresupuestoView>): void {
    const target = event.event?.target as HTMLElement | null;
    const action = target?.closest('[data-action]')?.getAttribute('data-action');

    if (!action || !event.data) return;

    // Prevenir acciones si el botón está deshabilitado
    const button = target?.closest('[data-action]') as HTMLButtonElement;
    if (button?.disabled) return;

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
    Swal.fire({
      title: '¿Aprobar presupuesto?',
      text: "El presupuesto será marcado como aprobado y pasará a la lista de reparaciones.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {
        // 🔹 2 y 3. Servicio real integrado y descomentado
        this.presupuestosService.aprobar(id).subscribe({
          next: () => {
            // 🔹 5. UI actualizada automáticamente desde la base de datos
            this.getPresupuestos();
            Swal.fire('¡Aprobado!', 'El presupuesto ha sido aprobado correctamente.', 'success');
          },
          error: (error) => {
            // 🔹 4. Manejo de errores
            console.error('Error al aprobar:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Hubo un error al intentar aprobar el presupuesto.',
            });
          }
        });
      }
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

  getRowClass = (params: any) => {
    return '';
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkResponsiveColumns(event.target.innerWidth);
  }

  private checkResponsiveColumns(width: number) {
    if (!this.gridApi) return;

    if (width < 768) {
      this.gridApi.setColumnsVisible(['valorManoDeObra', 'fechaCreacion'], false);
    } else {
      this.gridApi.setColumnsVisible(['valorManoDeObra', 'fechaCreacion'], true);
    }

    this.gridApi.sizeColumnsToFit();
  }

}
