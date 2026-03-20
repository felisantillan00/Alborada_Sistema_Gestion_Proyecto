import { Injectable } from '@angular/core';
import { Api } from '../api';
import { Proveedor } from '../../models/proveedor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService extends Api<Proveedor> {
  constructor(http: HttpClient) {
    super(http, 'proveedores');
  }
}
