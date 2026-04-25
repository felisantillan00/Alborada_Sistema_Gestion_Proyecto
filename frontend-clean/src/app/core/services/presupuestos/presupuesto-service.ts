import { HttpClient } from "@angular/common/http";
import { Presupuestos } from "../../../pages/presupuestos/presupuestos";
import { PresupuestoRequest, PresupuestoView } from "../../models/presupuesto";
import { Api } from "../api";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class PresupuestosService extends Api<PresupuestoView, PresupuestoRequest> {

  constructor(http: HttpClient) {
    super(http, 'presupuesto');
  }

    aprobar(id: number): Observable<PresupuestoView> {
      return this.http.put<PresupuestoView>(
        `${this.baseUrl}/${id}/terminar`,
        {},
        { headers: this.getHeaders() }
      );
    }
  
}