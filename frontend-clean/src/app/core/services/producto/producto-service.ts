import { Injectable } from '@angular/core';
import { Api } from '../api';
import { ProductoRequest, ProductoView } from '../../models/producto';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Pagina } from '../../models/pagina'; // (Para cuando conectemos con Spring Boot)

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends Api<ProductoView, ProductoRequest> {

  constructor(http: HttpClient) {
    super(http, 'producto');
  }

}
