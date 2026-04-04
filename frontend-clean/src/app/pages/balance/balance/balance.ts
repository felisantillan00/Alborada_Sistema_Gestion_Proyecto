import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../../core/services/balance/balance-service';
import { BalanceView } from '../../../core/models/balance';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './balance.html',
  styleUrl: './balance.css',
})
export class Balance implements OnInit {
  estadisticas: BalanceView | null = null;
  loadingEstadisticas = false;
  loadingReparaciones = false;

  reparacionesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Reparaciones',
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.1)',
        pointBackgroundColor: '#198754',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  reparacionesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private balanceService: BalanceService) { }

  ngOnInit(): void {
    this.getEstadisticas()
    this.getReparacionesMensuales()
  }

  getEstadisticas(): void {
    this.loadingEstadisticas = true;
    this.balanceService.getEstadisticas().subscribe({
      next: (resp) => {
        this.estadisticas = resp;
        this.loadingEstadisticas = false;
      },
      error: (err) => {
        console.error('Error al cargar las estadísticas:', err);
        this.loadingEstadisticas = false;
      }
    })
  }

  getReparacionesMensuales(): void {
    this.loadingReparaciones = true;
    this.balanceService.getReparacionesMensuales().subscribe({
      next: (data) => {
        this.reparacionesChartData = {
          ...this.reparacionesChartData,
          labels: data.map(d => d.mes),
          datasets: [{
            ...this.reparacionesChartData.datasets[0],
            data: data.map(d => d.total)
          }]
        };
        this.loadingReparaciones = false;
      },
      error: (err) => {
        console.error('Error al obtener reparaciones:', err);
        this.loadingReparaciones = false;
      }
    });
  }

  get margen(): number {
    if (!this.estadisticas || this.estadisticas.ingresosSemestrales === 0) return 0;
    return Math.round((this.estadisticas.gananciasSemestrales / this.estadisticas.ingresosSemestrales) * 100);
  }
}