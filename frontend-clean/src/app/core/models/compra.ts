export interface CompraView {
  id: string;
  total: number;
  nombreProveedor: string;
  fecha: string;
  Productos: {
    id: string;
    Nombre: string;
    Cantidad: number;
    Precio: number;
  }[];
}

export interface CompraRequest {
  id?: string;
  total: number;
  nombreProveedor: string;
  fecha?: string;
  Productos: {
    id?: string;
    Cantidad: number;
    PrecioCompra: number;
  }[];
}
