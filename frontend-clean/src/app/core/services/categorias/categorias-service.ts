import { Injectable } from '@angular/core';
import { Api } from '../api';
import { Categoria } from '../../models/categoria';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService extends Api<Categoria>{
  constructor(http: HttpClient) {
    super(http, 'categorias');
  }
}
