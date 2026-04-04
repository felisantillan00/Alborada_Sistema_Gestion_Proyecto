import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../../core/services/balance/balance-service';
import { BalanceView } from '../../../core/models/balance';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance.html',
  styleUrl: './balance.css',
})
export class Balance implements OnInit {
  estadisticas: BalanceView | null = null;
  loadingEstadisticas = false;


  constructor(private balanceService: BalanceService) {}

  ngOnInit(): void {
    this.getEstadisticas()
  }

  getEstadisticas(): void {
    this.loadingEstadisticas = true;
    this.balanceService.getEstadisticas().subscribe({
      next:(resp) =>{
        this.estadisticas = resp;
        this.loadingEstadisticas = false;
      },
      error:(err) =>{
        console.error('Error al cargar las estadísticas:', err);
        this.loadingEstadisticas = false;
      }
    })
  }

  get margen(): number{
    if(!this.estadisticas || this.estadisticas.ingresosSemestrales === 0) return 0;
    return Math.round((this.estadisticas.gananciasSemestrales / this.estadisticas.ingresosSemestrales) * 100);
  }
}