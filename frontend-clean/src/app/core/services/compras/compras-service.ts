import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../api';
import { CompraRequest, CompraView } from '../../models/compra';

@Injectable({
  providedIn: 'root',
})
export class ComprasService extends Api<CompraView, CompraRequest> {
  constructor(http: HttpClient) {
    super(http, 'compras');
  }
}
