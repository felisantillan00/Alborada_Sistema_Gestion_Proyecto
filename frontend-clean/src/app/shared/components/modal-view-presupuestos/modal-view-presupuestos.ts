import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PresupuestoView } from '../../../core/models/presupuesto';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-presupuestos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-view-presupuestos.html',
})
export class ModalViewPresupuesto {
  @Input() mode: ModalMode = 'create';
  @Input() presupuesto: PresupuestoView | null = null;

  @Output() submitted = new EventEmitter<ModalMode>();

  
}
