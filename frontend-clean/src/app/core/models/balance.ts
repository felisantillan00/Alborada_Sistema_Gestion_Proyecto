export interface BalanceView {
  ingresosMensuales: number;
  gastosMensuales: number;
  gananciasMensuales: number;
  promedioGananciasMensuales: number;
}

export interface BalanceResponse {
  ingresosMensuales: number;
  gastosMensuales: number;
  gananciasMensuales: number;
  promedioGananciasMensuales: number;
}

export interface ResparacionesMensuales {
    mes: string;
    total: number;
}

export interface PieChartData {
  totalVentas: number;
  totalReparaciones: number;
}

export interface VentasMensuales {
  mes: string;
  total: number;
}

export interface ComprasMensuales {
  mes: string;
  total: number;
}

export interface TotalesActuales {
  ventas: number;
  reparaciones: number;
}
