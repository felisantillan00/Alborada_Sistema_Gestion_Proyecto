import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reparaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reparaciones.html',
})
export class Reparaciones {

  onNewReparacion(): void {
    console.log('Nueva reparación');
  }

}