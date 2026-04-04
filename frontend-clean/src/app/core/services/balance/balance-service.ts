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
        return this.http.get<BalanceResponse>(`${this.baseUrl}balance`, {headers: this.getHeaders()})
        .pipe(map(res => res.content[0]));
    }

    getReparacionesMensuales(): Observable<ResparacionesMensuales[]> {
        return this.http.get<ResparacionesMensuales[]>(`${this.baseUrl}reparacionesMensuales`, {headers: this.getHeaders()});
    }

    getPie() : Observable<PieChartData>{
        return this.http.get<PieChartData>(`${this.baseUrl}pie`, {headers: this.getHeaders()});
    }

    getVentasMensuales(): Observable<VentasMensuales[]> {
        return this.http.get<VentasMensuales[]>(`${this.baseUrl}ventasMensuales`, {headers: this.getHeaders()});
    }

    getComprasMensuales(): Observable<ComprasMensuales[]> {
        return this.http.get<ComprasMensuales[]>(`${this.baseUrl}comprasMensuales`, {headers: this.getHeaders()});
    }

    getTotalesActuales(): Observable<TotalesActuales> {
        return this.http.get<TotalesActuales>(`${this.baseUrl}totalesActuales`, {headers: this.getHeaders()});
    }
}