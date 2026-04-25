import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';
import { BalanceView, BalanceResponse, ResparacionesMensuales, PieChartData, VentasMensuales, ComprasMensuales, TotalesActuales } from '../../models/balance';

@Injectable({
    providedIn: 'root',
})

export class BalanceService {
    private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

    private getHeaders() : HttpHeaders{
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    getEstadisticas() : Observable<BalanceView>{
        return this.http.get<BalanceResponse>(`${this.baseUrl}estadisticas`, {headers: this.getHeaders()})
        .pipe(map(res => res.content[0]));
    }

    getReparacionesMensuales(): Observable<ResparacionesMensuales[]> {
      return this.http.get<ResparacionesMensuales[]>(`${this.baseUrl}estadisticas/reparaciones-mensuales`, {headers: this.getHeaders()});
    }

    getPie() : Observable<PieChartData>{
      return this.http.get<PieChartData>(`${this.baseUrl}estadisticas/pie`, {headers: this.getHeaders()});
    }

    getVentasMensuales(): Observable<VentasMensuales[]> {
      return this.http.get<VentasMensuales[]>(`${this.baseUrl}estadisticas/ventas-mensuales`, {headers: this.getHeaders()});
    }

    getComprasMensuales(): Observable<ComprasMensuales[]> {
      return this.http.get<ComprasMensuales[]>(`${this.baseUrl}estadisticas/compras-mensuales`, {headers: this.getHeaders()});
    }

    getTotalesActuales(): Observable<TotalesActuales> {
      return this.http.get<TotalesActuales>(`${this.baseUrl}estadisticas/totalesActuales`, {headers: this.getHeaders()});
    }
}
