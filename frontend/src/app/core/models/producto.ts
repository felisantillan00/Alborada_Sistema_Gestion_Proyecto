export interface Producto {
  id: number;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  proveedorId: number;
  categoriaId: number;
  marcaId: number;
}
