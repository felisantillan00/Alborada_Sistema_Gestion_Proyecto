export interface VentaRequest {
  Id?: string;
  NombreCliente: string;
  PrecioTotal: number;
  Fecha?: string;
  FormaDePago: string;
  Productos: {
    Id: string;
    Cantidad: number;
  }[];
}
export interface VentaView {
  Id: string;
  NombreCliente: string;
  PrecioTotal: number;
  Fecha: string;
  FormaDePago: string;
  Productos: {
    Id: string;
    Nombre: string;
    Cantidad: number;
    PrecioVenta: number;
  }[];
}
