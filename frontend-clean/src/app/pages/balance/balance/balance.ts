import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../../core/services/balance/balance-service';
import { BalanceView } from '../../../core/models/balance';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin } from 'rxjs';

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
  loadingPie = false;
  loadingTotales = false;
  loadingBar = false;
  loadingVentas = false;
  totalVentas: number = 0;
  totalReparaciones: number = 0;

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

  pieChartData: ChartData<'pie'> = {
    labels: ['Ventas', 'Reparaciones'],
    datasets: [{
      data: [],
      backgroundColor: ['#198754', '#212529'],
      hoverBackgroundColor: ['#157347', '#343a40'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed;
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return ` $${value.toLocaleString()} (${pct}%)`;
          }
        }
      }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Ventas',
      data: [],
      backgroundColor: '#198754',
      borderColor: '#198754',
      borderWidth: 1,
      borderRadius: 6,
    },
    {
      label: 'Compras',
      data: [],
      backgroundColor: 'rgba(220, 53, 69, 0.8)',
      borderColor: '#dc3545',
      borderWidth: 1,
      borderRadius: 6,
    }]
  }

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  ventasLineData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Ventas',
        data: [],
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.08)',
        pointBackgroundColor: '#198754',
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      }]
  }

  ventasLineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private balanceService: BalanceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getEstadisticas()
    this.getReparacionesMensuales()
    this.getPie()
    this.getTotalesActuales()
    this.getIngresosVSGastos()
    this.getVentasMensuales()
  }

  getEstadisticas(): void {
    this.loadingEstadisticas = true;
    this.balanceService.getEstadisticas().subscribe({
      next: (resp) => {
        this.estadisticas = resp;
        this.loadingEstadisticas = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las estadísticas:', err);
        this.loadingEstadisticas = false;
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener reparaciones:', err);
        this.loadingReparaciones = false;
        this.cdr.detectChanges();
      }
    });
  }

  getPie(): void {
    this.loadingPie = true;
    this.balanceService.getPie().subscribe({
      next: (data) => {
        this.pieChartData = {
          ...this.pieChartData,
          datasets: [{
            ...this.pieChartData.datasets[0],
            data: [data.totalVentas, data.totalReparaciones]
          }]
        };
        this.loadingPie = false;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error al obtener datos del pie chart:', err);
        this.loadingPie = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTotalesActuales(): void {
    this.loadingTotales = true;
    this.balanceService.getTotalesActuales().subscribe({
      next: (data) => {
        this.totalVentas = data.ventas;
        this.totalReparaciones = data.reparaciones;
        this.loadingTotales = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener totales actuales:', err);
        this.loadingTotales = false;
        this.cdr.detectChanges();
      }
    });
  }

  getIngresosVSGastos(): void {
    this.loadingBar = true;
    forkJoin({
      ventas: this.balanceService.getVentasMensuales(),
      compras: this.balanceService.getComprasMensuales()
    }).subscribe({
      next: ({ ventas, compras }) => {
        this.barChartData = {
          ...this.barChartData,
          labels: ventas.map(v => v.mes),
          datasets: [
            {
              ...this.barChartData.datasets[0],
              data: ventas.map(v => v.total)
            },
            {
              ...this.barChartData.datasets[1],
              data: compras.map(c => c.total)
            }
          ]
        };
        this.loadingBar = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener ingresos vs gastos:', err);
        this.loadingBar = false;
        this.cdr.detectChanges();
      }
    })
  }

  getVentasMensuales(): void {
    this.loadingVentas = true;
    this.balanceService.getVentasMensuales().subscribe({
      next: (data) => {
        this.ventasLineData = {
          ...this.ventasLineData,
          labels: data.map(d => d.mes),
          datasets: [{
            ...this.ventasLineData.datasets[0],
            data: data.map(d => d.total)
          }]
        };
        this.loadingVentas = false;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error al obtener ventas mensuales:', err);
        this.loadingVentas = false;
        this.cdr.detectChanges();
      }
    });
  }

  get margen(): number {
    if (!this.estadisticas || this.estadisticas.ingresosMensuales === 0) return 0;
    return Math.round((this.estadisticas.gananciasMensuales / this.estadisticas.ingresosMensuales) * 100);
  }
}
