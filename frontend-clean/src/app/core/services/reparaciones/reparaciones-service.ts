import { Injectable } from '@angular/core';
import { Api } from '../api';
import { ReparacionRequest, ReparacionView } from '../../models/reparacion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReparacionesService extends Api<ReparacionView, ReparacionRequest> {

  constructor(http: HttpClient) {
    super(http, 'reparacion');
  }

  terminar(id: number): Observable<ReparacionView> {
    return this.http.put<ReparacionView>(
      `${this.baseUrl}/${id}/estado`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
