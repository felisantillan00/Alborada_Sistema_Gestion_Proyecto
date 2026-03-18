import { Injectable } from '@angular/core';
import { Api } from '../api';
import { Producto } from '../../models/producto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends Api<Producto> {

  constructor(http: HttpClient) {
    super(http, 'productos');
  }

}
