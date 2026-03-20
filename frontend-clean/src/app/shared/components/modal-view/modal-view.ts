import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductoView } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto/producto-service';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';

type ModalMode = 'create' | 'view' | 'edit' | 'delete';

@Component({
  selector: 'app-modal-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-view.html',
  styleUrl: './modal-view.css',
})
export class ModalView {
  @Input() mode: ModalMode = 'create';
  @Input() product: ProductoView | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<ModalMode>();

  get title(): string {
    switch (this.mode) {
      case 'create':
        return 'New Product';
      case 'view':
        return 'View Product';
      case 'edit':
        return 'Edit Product';
      case 'delete':
        return 'Delete Product';
      default:
        return 'Product';
    }
  }
}
