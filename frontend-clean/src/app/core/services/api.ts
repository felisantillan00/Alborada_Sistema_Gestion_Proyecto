import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Pagina } from '../models/pagina';

@Injectable()
export abstract class Api<TResponse, TRequest = TResponse> {

  protected baseUrl: string;

  constructor(
    protected http: HttpClient,
    protected endpoint: string
  ) {
    this.baseUrl = `${environment.apiUrl}${this.endpoint}`;
  }

  // -------------------------
  // HEADERS
  // -------------------------
  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // -------------------------
  // GET ALL
  // -------------------------
  getAll(params?: any): Observable<TResponse[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<TResponse[]>(this.baseUrl, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  // -------------------------
  // GET BY ID
  // -------------------------
  getById(id: number | string): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // -------------------------
  // POST
  // -------------------------
  create(item: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(this.baseUrl, item, {
      headers: this.getHeaders()
    });
  }

  // -------------------------
  // PUT
  // -------------------------
  update(id: number | string, item: TRequest): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.baseUrl}/${id}`, item, {
      headers: this.getHeaders()
    });
  }

  // -------------------------
  // DELETE
  // -------------------------
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getPage(params?: any): Observable<Pagina<TResponse>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<Pagina<TResponse>>(this.baseUrl, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }
}
