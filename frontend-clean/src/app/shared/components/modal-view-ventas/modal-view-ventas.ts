import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VentaView } from '../../../core/models/venta';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-view-ventas.html',
})
export class ModalViewVentas {
  @Input() mode: ModalMode = 'create';
  @Input() venta: VentaView | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

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
