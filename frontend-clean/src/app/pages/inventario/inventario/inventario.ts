import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowClickedEvent } from 'ag-grid-community';

import { ProductoView } from '../../../core/models/producto';
import { Pagina } from '../../../core/models/pagina';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { ModalView } from '../../../shared/components/modal-view/modal-view';
import { HostListener } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';


type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, AgGridAngular, ModalView],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {
  private gridApi!: GridApi;
  searchText: string = '';
  isSearchExpanded = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  currentFilter: 'all' | 'lowStock' | 'noStock' = 'all';

  productos: ProductoView[] = [];
  loadingProductos = false;

  modalOpen = false;
  modalMode: ModalMode = 'create';
  selectedProducto: ProductoView | null = null;

  readonly defaultColDef: ColDef<ProductoView> = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  readonly columnDefs: ColDef<ProductoView>[] = [
    { field: 'nombre', headerName: 'Nombre', minWidth: 200 },
    { field: 'precioCosto', headerName: 'Precio Compra' },
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

  constructor(private productoService: ProductoService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
      this.getProductos();
  }

  //getProductos(): void {
  //  this.loadingProductos = true;

  //  this.productoService
  //    .getPage()
  //    .pipe(
  //      catchError((error) => {
  //        console.error('Error al obtener productos:', error);
  //        this.loadingProductos = false;
  //        return of([] as ProductoView[]);
  //      })
  //    )
  //    .subscribe((data) => {
  //      this.productos = data.content;
  //      this.loadingProductos = false;
  //      console.log("SERAN?", this.productos)
  //    });
  //}

  getProductos(): void {
    this.loadingProductos = true;

    this.productoService
      .getPage()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener productos:', error);
          this.loadingProductos = false;

          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0
          } as Pagina<ProductoView>);
        })
      )
      .subscribe((data) => {
        this.productos = [...data.content]; //para dectectar cambios en el array y refrescar la tabla
        this.loadingProductos = false;
        this.cdr.detectChanges();           //fuerzo la deteccion
        console.log("SERAN?", this.productos)
      });
  }
  //Al realizar un cambio en el producto, 
  // se actualiza la tabla forzando a Angular a detectar el cambio y refrescar la tabla.
  getRowId= (params : any) => params.data.id.toString();

  onNewProduct(): void {
    this.openModal('create', null);
  }

  onRowClicked(event: RowClickedEvent<ProductoView>): void {
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
    this.selectedProducto = null;
    this.modalMode = 'create';
  }

  onModalSubmit(mode: ModalMode): void {
    this.closeModal();
    this.getProductos();
  }

  private openModal(mode: ModalMode, product: ProductoView | null): void {
    this.modalMode = mode;
    this.selectedProducto = product;
    this.modalOpen = true;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.checkResponsiveColumns(window.innerWidth);
  }

  //Por si el usuario rota el celular  o cambia el tamaño de la pantalla, se ajustan las columnas para que se vean bien
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkResponsiveColumns(event.target.innerWidth);
  }
  //Oculta/muestra columnas
  private checkResponsiveColumns(width: number) {
    if(!this.gridApi) return;

    //si el tamaño es de celular, oculto columnas no tan importantes
    if (width < 768) {
      this.gridApi.setColumnsVisible(['id', 'precioCosto', 'nombreProveedor', 'nombreCategoria', 'nombreMarca'], false)
    }else{
      this.gridApi.setColumnsVisible(['id', 'precioCosto', 'nombreProveedor', 'nombreCategoria', 'nombreMarca'], true)
    }
    //hago que el tamaño de las columnas se ajuste al nuevo tamaño de la pantalla
    this.gridApi.sizeColumnsToFit();
  }

  //Cada vez que el usuario escribe se actualiza el quick filter de af-grid
  onSearchInput(event: any) {
    this.searchText = event.target.value;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', this.searchText);
    }
  }

  toggleSearch() {
    if(this.isSearchExpanded && this.searchText) {
      this.searchText = '';
      if(this.gridApi) {
        this.gridApi.setGridOption('quickFilterText','')
      }
      this.isSearchExpanded = false;
    }else{
      this.isSearchExpanded = !this.isSearchExpanded;
      if(this.isSearchExpanded){
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

  applyFilter(filterType: 'all' | 'lowStock' | 'noStock') {
    this.currentFilter = filterType;
    if (this.gridApi) {
      // Le avisamos a la grilla que algo cambió y debe volver a ejecutar doesExternalFilterPass
      this.gridApi.onFilterChanged();
    }
  }

  clearFiltersAndSort() {
    this.applySort('', null); // Limpia orden
    this.applyFilter('all');  // Limpia filtro de stock
    
    // Opcional: limpiar también la barra de búsqueda si lo deseas
    // this.searchText = '';
    // if (this.gridApi) this.gridApi.setGridOption('quickFilterText', '');
  }

  // Funciones requeridas por AG Grid para filtros externos (usamos arrow functions para no perder el contexto 'this')
  isExternalFilterPresent = (): boolean => {
    return this.currentFilter !== 'all';
  };

  doesExternalFilterPass = (node: any): boolean => {
    switch (this.currentFilter) {
      case 'lowStock':
        // Consideramos "Stock bajo" entre 1 y 5 unidades
        return node.data.stock > 0 && node.data.stock <= 5;
      case 'noStock':
        // Sin stock
        return node.data.stock === 0;
      default:
        return true;
    }
  };
}
