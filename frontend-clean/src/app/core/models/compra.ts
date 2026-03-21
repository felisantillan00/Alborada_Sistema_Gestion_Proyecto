export interface CompraView {
  Id: string;
  PrecioTotal: number;
  NombreProveedor: string;
  Fecha: string;
  Producto: {
    Id: string;
    Nombre: string;
    Cantidad: number;
    Precio: number;
  }[];
}

export interface CompraRequest {
  Id?: string;
  PrecioTotal: number;
  NombreProveedor: string;
  Fecha?: string;
  Producto: {
    Id?: string;
    Cantidad: number;
    PrecioCompra: number;
  }[];
}
