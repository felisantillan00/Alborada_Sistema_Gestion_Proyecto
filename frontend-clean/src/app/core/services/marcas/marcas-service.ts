import { Injectable } from '@angular/core';
import { Api } from '../api';
import { Marca } from '../../models/marca';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MarcasService extends Api<Marca> {
  constructor(http: HttpClient) {
    super(http, 'marcas');
  }
}
