import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VentaRequest, VentaView } from '../../models/venta';
import { Api } from '../api';

@Injectable({
  providedIn: 'root',
})
export class VentasService extends Api<VentaView, VentaRequest> {
  constructor(http: HttpClient) {
    super(http, 'venta');
  }
}
