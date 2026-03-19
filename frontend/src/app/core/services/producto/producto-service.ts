import { Injectable } from '@angular/core';
import { Api } from '../api';
import { Producto } from '../../models/producto';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
//import { Page } from '../../models/page'; // (Para cuando conectemos con Spring Boot)

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends Api<Producto> {

  constructor(http: HttpClient) {
    super(http, 'productos');
  }

  /*---------------------------------------------------------------------------
  METODOS ESPECIFICOS
  */

 //Transformacion con RxJS, filtro productos con poco stock
 getProductosStockBajo(limite : number= 5):Observable<Producto[]>{
    return this.getAll().pipe(
      map(productos => productos.filter(p => p.stock <= limite))
    );
 }

 //Implementacion de Paginacion
 //asi funcion solo para el json-server, para Spring Boot es distinto
 getProductosPaginados(pagina: number, cantidad: number): Observable<Producto[]> {
    
    const params = {
      _page: pagina,
      _limit: cantidad
    };

    return this.getAll(params);
  }

  /* (Para cuando conectemos con Spring Boot)
     Hablar con pepo para devolver un Observable<Page<T>>
  getProductosPaginadosSpring(pagina: number, cantidad: number): Observable<Page<Producto>> {
    return this.http.get<Page<Producto>>(`${this.baseUrl}?page=${pagina}&size=${cantidad}`);
  }
  */
}
