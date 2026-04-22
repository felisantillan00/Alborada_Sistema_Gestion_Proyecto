export interface CompraView {
  id: string;
  total: number;
  nombreProveedor: string;
  fecha: string;
  formaPago: FormaPago;
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
  formaPago: FormaPago;
  Productos: {
    id?: string;
    Cantidad: number;
    PrecioCompra: number;
  }[];
}

export type FormaPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
export const FORMAS_PAGO: {label: string; value: FormaPago}[] = [
  { label: 'Efectivo',          value: 'EFECTIVO' },
  { label: 'Tarjeta',           value: 'TARJETA' },
  { label: 'Transferencia',     value: 'TRANSFERENCIA' },
]; 