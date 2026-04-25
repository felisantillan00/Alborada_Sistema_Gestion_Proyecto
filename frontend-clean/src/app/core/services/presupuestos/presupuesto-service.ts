import { HttpClient } from "@angular/common/http";
import { Presupuestos } from "../../../pages/presupuestos/presupuestos";
import { PresupuestoRequest, PresupuestoView } from "../../models/presupuesto";
import { Api } from "../api";

export class PresupuestosService extends Api<PresupuestoView, PresupuestoRequest> {

  constructor(http: HttpClient) {
    super(http, 'presupuestosView');
  }
}