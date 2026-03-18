import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable()
export abstract class Api<T> {

  protected baseUrl: string;

  constructor(
    protected http: HttpClient,
    protected endpoint: string
  ) {
    this.baseUrl = `${environment.apiUrl}/${this.endpoint}`;
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
  getAll(params?: any): Observable<T[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<T[]>(this.baseUrl, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  // -------------------------
  // GET BY ID
  // -------------------------
  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // -------------------------
  // POST
  // -------------------------
  create(item: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, item, {
      headers: this.getHeaders()
    });
  }

  // -------------------------
  // PUT
  // -------------------------
  update(id: number | string, item: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, item, {
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

}
