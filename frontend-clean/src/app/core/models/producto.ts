export interface ProductoRequest {
  id: number;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  proveedorId: number;
  categoriaId: number;
  marcaId: number;
}
export interface ProductoView {
  id: number;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  nombreProveedor: string;
  nombreCategoria: string;
  nombreMarca: string;
}
