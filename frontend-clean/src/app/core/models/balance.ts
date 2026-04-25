export interface BalanceView {
    ingresosSemestrales: number;
    gastosSemestrales: number;
    gananciasSemestrales: number;
    promedioGananciasSemestrales: number;
}

export interface BalanceResponse {
    content: BalanceView[];
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