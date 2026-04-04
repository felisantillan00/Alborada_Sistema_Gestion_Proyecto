import { Injectable } from '@angular/core';
import { Api } from '../api';
import { ReparacionRequest, ReparacionView } from '../../models/reparacion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReparacionesService extends Api<ReparacionView, ReparacionRequest> {

  constructor(http: HttpClient) {
    super(http, 'reparaciones');
  }

  // 🔹 SOLO método extra
  terminar(id: number): Observable<ReparacionView> {
    return this.http.put<ReparacionView>(`${this.baseUrl}/${id}`, {
      estadoReparacion: 'LISTO_PARA_ENTREGA'
    }, {
      headers: this.getHeaders()
    });
  }
}