export interface ProductoRequest {
  id: number;
  nombre: string;
  precioCosto: number;
  precioVenta: number;
  stock: number;
  idProveedor: number;
  idCategoria: number;
  idMarca: number;
}
export interface ProductoView {
  id: number;
  nombre: string;
  precioCosto: number;
  precioVenta: number;
  stock: number;
  nombreProveedor: string;
  nombreCategoria: string;
  nombreMarca: string;
}
